const userRepository = require('../repositories/userRepository');
const { 
  generateTokens, 
  setTokenCookies, 
  clearTokenCookies,
  verifyRefreshToken,
  generateAccessToken 
} = require('../utils/jwt');
const { hashPassword, comparePassword, isStrongPassword } = require('../utils/password');
const { AppError, createValidationError } = require('../utils/errors');
const { HTTP_STATUS, ERROR_CODES, USER_ROLES } = require('../constants');
const { logger } = require('../utils/logger');
const config = require('../config/env');

class AuthService {
  async register(userData) {
    const { name, email, password, phone } = userData;

    // Validate password strength
    if (!isStrongPassword(password)) {
      throw createValidationError([{
        field: 'password',
        message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      }]);
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        'Email address is already registered',
        HTTP_STATUS.CONFLICT
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: USER_ROLES.USER
    });

    logger.info('New user registered', { userId: user._id, email });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  async login(credentials, res, reqInfo = {}) {
    const { email, password } = credentials;

    // Find user with password
    const user = await userRepository.findByEmail(email, { selectPassword: true });
    
    if (!user) {
      throw new AppError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!user.isActive) {
      throw new AppError(
        ERROR_CODES.AUTH_UNAUTHORIZED,
        'Account has been deactivated. Please contact support.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token
    const refreshTokenData = {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      device: reqInfo.userAgent || 'Unknown',
      ipAddress: reqInfo.ip
    };

    await userRepository.addRefreshToken(user._id, refreshTokenData);

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    logger.info('User logged in', { 
      userId: user._id, 
      email: user.email,
      ip: reqInfo.ip 
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      },
      accessToken
    };
  }

  async logout(userId, res) {
    // Clear all tokens for this user
    await userRepository.removeAllRefreshTokens(userId);
    
    // Clear cookies
    clearTokenCookies(res);

    logger.info('User logged out', { userId });

    return { success: true };
  }

  async refreshToken(refreshToken, res) {
    if (!refreshToken) {
      throw new AppError(
        ERROR_CODES.AUTH_TOKEN_INVALID,
        'Refresh token is required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(
        ERROR_CODES.AUTH_TOKEN_INVALID,
        'Invalid refresh token',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Find user and verify token exists
    const user = await userRepository.findById(decoded.userId, { 
      selectRefreshTokens: true 
    });

    if (!user || !user.isActive) {
      throw new AppError(
        ERROR_CODES.AUTH_UNAUTHORIZED,
        'User not found or deactivated',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const storedToken = user.refreshTokens.find(t => t.token === refreshToken);
    
    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      throw new AppError(
        ERROR_CODES.AUTH_TOKEN_EXPIRED,
        'Refresh token has expired. Please log in again.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // Update cookie with new access token
    res.cookie('accessToken', newAccessToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    logger.info('Token refreshed', { userId: user._id });

    return { 
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      addresses: user.addresses,
      preferences: user.preferences,
      createdAt: user.createdAt
    };
  }

  async updateProfile(userId, updateData) {
    const allowedUpdates = ['name', 'phone', 'avatar'];
    const updates = {};

    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    const user = await userRepository.update(userId, updates);

    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    // Validate new password strength
    if (!isStrongPassword(newPassword)) {
      throw createValidationError([{
        field: 'newPassword',
        message: 'New password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
      }]);
    }

    // Get user with password
    const user = await userRepository.findById(userId, { selectPassword: true });

    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new AppError(
        ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        'Current password is incorrect',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await userRepository.update(userId, { password: hashedPassword });

    logger.info('Password changed', { userId });

    return { success: true };
  }

  async addAddress(userId, addressData) {
    const user = await userRepository.addAddress(userId, addressData);

    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return user.addresses;
  }

  async updateAddress(userId, addressId, addressData) {
    const user = await userRepository.updateAddress(userId, addressId, addressData);

    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User or address not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return user.addresses;
  }

  async deleteAddress(userId, addressId) {
    const user = await userRepository.removeAddress(userId, addressId);

    if (!user) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'User or address not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return user.addresses;
  }
}

module.exports = new AuthService();
