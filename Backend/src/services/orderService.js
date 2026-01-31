const mongoose = require('mongoose');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, ERROR_CODES, ORDER_STATUS, ORDER_STATUS_FLOW } = require('../constants');
const { logger } = require('../utils/logger');

class OrderService {
  async createOrder(userId, orderData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { items, shippingAddress, paymentMethod, notes } = orderData;

      // Validate stock and calculate prices
      const orderItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = await productRepository.findById(item.productId, { session });
        
        if (!product) {
          throw new AppError(
            ERROR_CODES.RESOURCE_NOT_FOUND,
            `Product not found: ${item.productId}`,
            HTTP_STATUS.NOT_FOUND
          );
        }

        if (!product.isActive) {
          throw new AppError(
            ERROR_CODES.RESOURCE_NOT_FOUND,
            `Product is no longer available: ${product.name}`,
            HTTP_STATUS.BAD_REQUEST
          );
        }

        if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
          throw new AppError(
            ERROR_CODES.RESOURCE_CONFLICT,
            `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}`,
            HTTP_STATUS.BAD_REQUEST
          );
        }

        const itemPrice = product.price;
        const itemSubtotal = itemPrice * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: itemPrice,
          name: product.name,
          image: product.primaryImage?.url || product.images[0]?.url
        });

        // Decrease stock
        await productRepository.decreaseStock(product._id, item.quantity, session);
        await productRepository.incrementSales(product._id, item.quantity);
      }

      // Calculate totals
      const taxRate = 0.08;
      const shippingCost = subtotal >= 50 ? 0 : 5.99;
      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

      // Create order
      const order = await orderRepository.create({
        user: userId,
        items: orderItems,
        shipping: {
          address: shippingAddress,
          cost: shippingCost
        },
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'completed'
        },
        pricing: {
          subtotal,
          shipping: shippingCost,
          tax,
          taxRate,
          total
        },
        notes: {
          customer: notes
        }
      }, { session });

      await session.commitTransaction();
      
      logger.info('Order created', { 
        orderId: order._id, 
        orderNumber: order.orderNumber,
        userId,
        total 
      });

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserOrders(userId, query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const result = await orderRepository.paginate(
      { user: userId, isActive: true },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'items.product', select: 'name images slug' }
        ]
      }
    );

    return {
      orders: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        itemsPerPage: result.limit
      }
    };
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await orderRepository.findById(orderId, {
      populate: [
        { path: 'items.product', select: 'name images slug' },
        { path: 'user', select: 'name email phone' }
      ]
    });

    if (!order) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Order not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check authorization
    if (userRole !== 'admin' && userRole !== 'manager' && order.user._id.toString() !== userId) {
      throw new AppError(
        ERROR_CODES.AUTH_FORBIDDEN,
        'You do not have permission to view this order',
        HTTP_STATUS.FORBIDDEN
      );
    }

    return order;
  }

  async getOrderByNumber(orderNumber) {
    const order = await orderRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Order not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return order;
  }

  async updateOrderStatus(orderId, newStatus, note, updatedBy, userRole) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Order not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Validate status transition
    const allowedTransitions = ORDER_STATUS_FLOW[order.status];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        `Cannot transition from ${order.status} to ${newStatus}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Only admin/manager can cancel orders in certain statuses
    if (newStatus === ORDER_STATUS.CANCELLED && 
        ![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status) &&
        userRole !== 'admin' && userRole !== 'manager') {
      throw new AppError(
        ERROR_CODES.AUTH_FORBIDDEN,
        'Only administrators can cancel orders at this stage',
        HTTP_STATUS.FORBIDDEN
      );
    }

    const updatedOrder = await orderRepository.updateStatus(
      orderId,
      newStatus,
      note,
      updatedBy
    );

    // Restore stock if cancelled
    if (newStatus === ORDER_STATUS.CANCELLED) {
      for (const item of order.items) {
        await productRepository.updateStock(item.product, item.quantity);
      }
    }

    logger.info('Order status updated', {
      orderId,
      oldStatus: order.status,
      newStatus,
      updatedBy
    });

    return updatedOrder;
  }

  async cancelOrder(orderId, reason, cancelledBy, userRole) {
    return this.updateOrderStatus(
      orderId,
      ORDER_STATUS.CANCELLED,
      reason,
      cancelledBy,
      userRole
    );
  }

  async getAllOrders(query = {}, isAdmin = false) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;

    const result = await orderRepository.findWithFilters(query, {
      page,
      limit
    });

    return {
      orders: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        itemsPerPage: result.limit
      }
    };
  }

  async getDashboardStatistics(dateRange = {}) {
    const orderStats = await orderRepository.getStatistics(dateRange);
    const salesByDay = await orderRepository.getSalesByDay(30);
    const recentOrders = await orderRepository.getRecentOrders(10);

    return {
      orders: orderStats,
      sales: salesByDay,
      recentOrders
    };
  }

  async getSalesReport(dateRange) {
    const stats = await orderRepository.getStatistics(dateRange);
    const salesByDay = await orderRepository.getSalesByDay(30);
    const salesByCategory = await orderRepository.getSalesByCategory(dateRange);
    const topProducts = await orderRepository.getTopProducts(10, dateRange);

    return {
      summary: stats,
      byDay: salesByDay,
      byCategory: salesByCategory,
      topProducts
    };
  }

  async deleteOrder(orderId) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Order not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Soft delete
    await orderRepository.softDelete(orderId);

    // Restore stock if order was not cancelled/delivered
    if (![ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED].includes(order.status)) {
      for (const item of order.items) {
        await productRepository.updateStock(item.product, item.quantity);
      }
    }

    logger.info('Order deleted', { orderId });

    return { success: true };
  }
}

module.exports = new OrderService();
