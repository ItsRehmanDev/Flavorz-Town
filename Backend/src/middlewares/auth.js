const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const ApiResponse = require('../utils/response');
const { logger } = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Authentication token is required');
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    
    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account has been deactivated');
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      path: req.path,
      ip: req.ip
    });
    
    return ApiResponse.unauthorized(res, error.message);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed', {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path
      });
      
      return ApiResponse.forbidden(res, 'Insufficient permissions to access this resource');
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password -refreshTokens');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

module.exports = {
  authMiddleware,
  authorize,
  optionalAuth
};
