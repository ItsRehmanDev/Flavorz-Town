const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants');

class AppError extends Error {
  constructor(code, message, statusCode, details = null) {
    super(message || ERROR_MESSAGES[code] || 'An error occurred');
    
    this.code = code;
    this.statusCode = statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: new Date().toISOString()
    };
  }
}

// Factory functions for common errors
const createValidationError = (details) => {
  return new AppError(
    'VALIDATION_ERROR',
    'Validation failed',
    HTTP_STATUS.BAD_REQUEST,
    details
  );
};

const createNotFoundError = (resource = 'Resource') => {
  return new AppError(
    'RESOURCE_NOT_FOUND',
    `${resource} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};

const createUnauthorizedError = (message) => {
  return new AppError(
    'AUTH_UNAUTHORIZED',
    message || 'Please log in to access this resource',
    HTTP_STATUS.UNAUTHORIZED
  );
};

const createForbiddenError = (message) => {
  return new AppError(
    'AUTH_FORBIDDEN',
    message || 'You do not have permission to access this resource',
    HTTP_STATUS.FORBIDDEN
  );
};

module.exports = {
  AppError,
  createValidationError,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError
};
