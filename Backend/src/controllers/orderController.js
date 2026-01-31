const orderService = require('../services/orderService');
const ApiResponse = require('../utils/response');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user._id;
      const orderData = req.body;
      
      const order = await orderService.createOrder(userId, orderData);
      ApiResponse.created(res, { order }, 'Order placed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await orderService.getUserOrders(userId, req.query);
      
      ApiResponse.paginated(res, result.orders, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userRole = req.user.role;
      
      const order = await orderService.getOrderById(id, userId, userRole);
      ApiResponse.success(res, { order });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const updatedBy = req.user._id;
      const userRole = req.user.role;
      
      const order = await orderService.updateOrderStatus(id, status, note, updatedBy, userRole);
      ApiResponse.success(res, { order }, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const cancelledBy = req.user._id;
      const userRole = req.user.role;
      
      const order = await orderService.cancelOrder(id, reason, cancelledBy, userRole);
      ApiResponse.success(res, { order }, 'Order cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const result = await orderService.getAllOrders(req.query, true);
      ApiResponse.paginated(res, result.orders, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStatistics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await orderService.getDashboardStatistics({ start: startDate, end: endDate });
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async getSalesReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await orderService.getSalesReport({ start: startDate, end: endDate });
      ApiResponse.success(res, report);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      await orderService.deleteOrder(id);
      ApiResponse.success(res, null, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
