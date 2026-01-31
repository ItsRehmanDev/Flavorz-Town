const { AppError } = require('../utils/errors');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
const ApiResponse = require('../utils/response');
const { logger } = require('../utils/logger');
const config = require('../config/env');

// Handle specific error types
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError('INVALID_INPUT', message, HTTP_STATUS.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new AppError('RESOURCE_ALREADY_EXISTS', message, HTTP_STATUS.CONFLICT);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError('VALIDATION_ERROR', message, HTTP_STATUS.BAD_REQUEST, errors);
};

const handleJWTError = () => {
  return new AppError('AUTH_TOKEN_INVALID', 'Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new AppError('AUTH_TOKEN_EXPIRED', 'Your token has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id
  });

  // Handle specific MongoDB/Mongoose errors
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Operational, trusted error: send message to client
  if (error instanceof AppError && error.isOperational) {
    return ApiResponse.error(
      res,
      error.message,
      error.statusCode,
      error.code,
      error.details
    );
  }

  // Programming or other unknown error: don't leak error details in production
  if (config.isProduction) {
    return ApiResponse.error(
      res,
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR'
    );
  }

  // In development, send full error details
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: error.message,
    stack: error.stack,
    error: error,
    timestamp: new Date().toISOString()
  });
};

// Unhandled promise rejection handler
const setupUnhandledRejectionHandler = () => {
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    process.exit(1);
  });
};

// Uncaught exception handler
const setupUncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    process.exit(1);
  });
};

module.exports = {
  globalErrorHandler,
  setupUnhandledRejectionHandler,
  setupUncaughtExceptionHandler
};
