const { HTTP_STATUS } = require('../constants');

class ApiResponse {
  static success(res, data, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static created(res, data, message = 'Created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage
      },
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'INTERNAL_ERROR', errors = null) {
    const response = {
      success: false,
      code,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static validationError(res, message, errors) {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', errors);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }

  static unauthorized(res, message = 'Authentication required') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED, 'AUTH_UNAUTHORIZED');
  }

  static forbidden(res, message = 'Insufficient permissions') {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN, 'AUTH_FORBIDDEN');
  }
}

module.exports = ApiResponse;
