const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const config = require('./src/config/env');
const { setupUnhandledRejectionHandler, setupUncaughtExceptionHandler } = require('./src/middlewares/errorHandler');
const { logger } = require('./src/utils/logger');

// Handle uncaught exceptions
setupUncaughtExceptionHandler();

// Connect to database
connectDatabase();

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
setupUnhandledRejectionHandler();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
