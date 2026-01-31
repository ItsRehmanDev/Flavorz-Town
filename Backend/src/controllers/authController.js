const authService = require('../services/authService');
const ApiResponse = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const userData = req.body;
      const user = await authService.register(userData);
      
      ApiResponse.created(res, { user }, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const credentials = req.body;
      const reqInfo = {
        ip: req.ip,
        userAgent: req.get('user-agent')
      };
      
      const result = await authService.login(credentials, res, reqInfo);
      
      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user._id;
      await authService.logout(userId, res);
      
      ApiResponse.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(refreshToken, res);
      
      ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const userId = req.user._id;
      const user = await authService.getCurrentUser(userId);
      
      ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const updateData = req.body;
      const user = await authService.updateProfile(userId, updateData);
      
      ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(userId, currentPassword, newPassword);
      
      ApiResponse.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req, res, next) {
    try {
      const userId = req.user._id;
      const addressData = req.body;
      const addresses = await authService.addAddress(userId, addressData);
      
      ApiResponse.success(res, { addresses }, 'Address added successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const userId = req.user._id;
      const { addressId } = req.params;
      const addressData = req.body;
      const addresses = await authService.updateAddress(userId, addressId, addressData);
      
      ApiResponse.success(res, { addresses }, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const userId = req.user._id;
      const { addressId } = req.params;
      const addresses = await authService.deleteAddress(userId, addressId);
      
      ApiResponse.success(res, { addresses }, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
