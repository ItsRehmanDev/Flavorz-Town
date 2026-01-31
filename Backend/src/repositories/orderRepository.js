const BaseRepository = require('./baseRepository');
const Order = require('../models/Order');
const { ORDER_STATUS } = require('../constants');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByUser(userId, options = {}) {
    return this.find(
      { user: userId, isActive: true },
      { 
        sort: { createdAt: -1 },
        populate: [
          { path: 'items.product', select: 'name images slug' },
          { path: 'statusHistory.updatedBy', select: 'name' }
        ],
        ...options 
      }
    );
  }

  async findByOrderNumber(orderNumber, options = {}) {
    return this.findOne(
      { orderNumber },
      {
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'items.product', select: 'name images slug' },
          { path: 'statusHistory.updatedBy', select: 'name' },
          { path: 'cancelledBy', select: 'name' }
        ],
        ...options
      }
    );
  }

  async findActive(options = {}) {
    return this.find(
      { isActive: true },
      {
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'items.product', select: 'name images' }
        ],
        sort: { createdAt: -1 },
        ...options
      }
    );
  }

  async findByStatus(status, options = {}) {
    return this.find(
      { status, isActive: true },
      {
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'items.product', select: 'name images' }
        ],
        sort: { createdAt: -1 },
        ...options
      }
    );
  }

  async findWithFilters(filters = {}, options = {}) {
    const query = { isActive: true };

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Payment status filter
    if (filters.paymentStatus) {
      query['payment.status'] = filters.paymentStatus;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    // User filter (for admin)
    if (filters.userId) {
      query.user = filters.userId;
    }

    // Search by order number
    if (filters.search) {
      query.orderNumber = { $regex: filters.search, $options: 'i' };
    }

    // Price range
    if (filters.minTotal || filters.maxTotal) {
      query['pricing.total'] = {};
      if (filters.minTotal) query['pricing.total'].$gte = parseFloat(filters.minTotal);
      if (filters.maxTotal) query['pricing.total'].$lte = parseFloat(filters.maxTotal);
    }

    return this.paginate(query, {
      populate: [
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name images' }
      ],
      sort: { createdAt: -1 },
      ...options
    });
  }

  async updateStatus(orderId, newStatus, note, updatedBy) {
    const order = await this.findById(orderId);
    if (!order) return null;

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      note,
      updatedBy,
      timestamp: new Date()
    });

    if (newStatus === ORDER_STATUS.CANCELLED && !order.cancelledAt) {
      order.cancelledAt = new Date();
    }

    return order.save();
  }

  async getRecentOrders(limit = 10) {
    return this.find(
      { isActive: true },
      {
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'items.product', select: 'name images' }
        ]
      }
    );
  }

  async getOrdersByDateRange(startDate, endDate, options = {}) {
    return this.find(
      {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        isActive: true
      },
      options
    );
  }

  async getStatistics(dateRange = {}) {
    return this.model.getStatistics(dateRange);
  }

  async getSalesByDay(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: ORDER_STATUS.CANCELLED },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          orders: 1
        }
      }
    ]);
  }

  async getSalesByCategory(dateRange = {}) {
    const matchStage = {
      status: { $ne: ORDER_STATUS.CANCELLED },
      isActive: true
    };

    if (dateRange.start || dateRange.end) {
      matchStage.createdAt = {};
      if (dateRange.start) matchStage.createdAt.$gte = new Date(dateRange.start);
      if (dateRange.end) matchStage.createdAt.$lte = new Date(dateRange.end);
    }

    return this.model.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] }
          },
          quantity: { $sum: '$items.quantity' },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: 1,
          revenue: 1,
          quantity: 1,
          orderCount: { $size: '$orders' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  async getTopProducts(limit = 10, dateRange = {}) {
    const matchStage = {
      status: { $ne: ORDER_STATUS.CANCELLED },
      isActive: true
    };

    if (dateRange.start || dateRange.end) {
      matchStage.createdAt = {};
      if (dateRange.start) matchStage.createdAt.$gte = new Date(dateRange.start);
      if (dateRange.end) matchStage.createdAt.$lte = new Date(dateRange.end);
    }

    return this.model.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] }
          },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit }
    ]);
  }

  async cancelOrder(orderId, reason, cancelledBy) {
    return this.updateStatus(
      orderId,
      ORDER_STATUS.CANCELLED,
      reason,
      cancelledBy
    );
  }

  async softDelete(orderId) {
    return this.update(orderId, { isActive: false });
  }

  async getPendingOrdersCount() {
    return this.count({ 
      status: ORDER_STATUS.PENDING, 
      isActive: true 
    });
  }

  async getTodayOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.find(
      { 
        createdAt: { $gte: today },
        isActive: true 
      },
      { sort: { createdAt: -1 } }
    );
  }
}

module.exports = new OrderRepository();
