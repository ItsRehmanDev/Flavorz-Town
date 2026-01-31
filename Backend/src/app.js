const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const config = require('./config/env');
const { requestLogger } = require('./utils/logger');
const {
  corsMiddleware,
  apiLimiter,
  securityHeaders,
  sanitizeMongo,
  preventXSS,
  securityErrorHandler
} = require('./middlewares/security');
const { globalErrorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Trust proxy (for production)
if (config.isProduction) {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(securityHeaders);
app.use(corsMiddleware);

// Request logging
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Data sanitization
app.use(sanitizeMongo);
app.use(preventXSS);

// Rate limiting (general API)
app.use('/api', apiLimiter);

// Health check endpoint (before routes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Flavorz Town API',
    version: '1.0.0',
    documentation: '/api/v1/docs'
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Security error handler
app.use(securityErrorHandler);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
