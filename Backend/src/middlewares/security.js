const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('../config/env');
const { logger } = require('../utils/logger');

// CORS configuration
const corsOptions = {
  origin: config.frontend.url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || config.rateLimit.windowMs,
    max: max || config.rateLimit.maxRequests,
    message: {
      success: false,
      code: 'TOO_MANY_REQUESTS',
      message: message || 'Too many requests, please try again later',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path
      });
      res.status(options.statusCode).json(options.message);
    }
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter();

// Stricter rate limiter for auth endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  'Too many authentication attempts, please try again later'
);

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// MongoDB sanitization
const sanitizeMongo = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn('MongoDB sanitization triggered', {
      path: req.path,
      key,
      ip: req.ip
    });
  }
});

// XSS prevention
const preventXSS = xss();

// Error handler for security violations
const securityErrorHandler = (err, req, res, next) => {
  if (err.name === 'SanitizationError') {
    logger.error('Security violation detected', {
      error: err.message,
      path: req.path,
      ip: req.ip
    });
    
    return res.status(400).json({
      success: false,
      code: 'SECURITY_VIOLATION',
      message: 'Invalid input detected',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

module.exports = {
  corsMiddleware: cors(corsOptions),
  apiLimiter,
  authLimiter,
  securityHeaders,
  sanitizeMongo,
  preventXSS,
  securityErrorHandler,
  createRateLimiter
};
