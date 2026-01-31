const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { AppError, HTTP_STATUS } = require('../constants');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    accessToken,
    refreshToken
  };
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(
        'AUTH_TOKEN_EXPIRED',
        'Token has expired',
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    throw new AppError(
      'AUTH_TOKEN_INVALID',
      'Invalid token',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    throw new AppError(
      'AUTH_TOKEN_INVALID',
      'Invalid refresh token',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie (short-lived)
  res.cookie('accessToken', accessToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  // Refresh token cookie (long-lived)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearTokenCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies
};
