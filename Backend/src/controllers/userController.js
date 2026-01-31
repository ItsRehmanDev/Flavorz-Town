const userRepository = require('../repositories/userRepository');
const ApiResponse = require('../utils/response');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, ERROR_CODES } = require('../constants');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const { search, role } = req.query;

      const filter = {};
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const result = await userRepository.paginate(filter, {
        page,
        limit,
        sort: { createdAt: -1 },
        select: '-password -refreshTokens'
      });

      ApiResponse.paginated(res, result.docs, {
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id, {
        select: '-password -refreshTokens',
        populate: { path: 'orders', options: { limit: 5, sort: { createdAt: -1 } } }
      });

      if (!user) {
        throw new AppError(
          ERROR_CODES.RESOURCE_NOT_FOUND,
          'User not found',
          HTTP_STATUS.NOT_FOUND
        );
      }

      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await userRepository.updateRole(id, role);

      if (!user) {
        throw new AppError(
          ERROR_CODES.RESOURCE_NOT_FOUND,
          'User not found',
          HTTP_STATUS.NOT_FOUND
        );
      }

      ApiResponse.success(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleUserActive(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.toggleActive(id);

      if (!user) {
        throw new AppError(
          ERROR_CODES.RESOURCE_NOT_FOUND,
          'User not found',
          HTTP_STATUS.NOT_FOUND
        );
      }

      ApiResponse.success(
        res, 
        { user }, 
        `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserStatistics(req, res, next) {
    try {
      const stats = await userRepository.getStatistics();
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
