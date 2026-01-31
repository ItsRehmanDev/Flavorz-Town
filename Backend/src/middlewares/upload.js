const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { AppError, HTTP_STATUS, ERROR_CODES } = require('../constants');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(
      ERROR_CODES.INVALID_FILE_TYPE,
      'Only JPEG, PNG, WebP, and GIF files are allowed',
      HTTP_STATUS.BAD_REQUEST
    ), false);
  }
};

// File size limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 5 // Max 5 files per upload
};

// Create multer instance
const createUploadMiddleware = (options = {}) => {
  const upload = multer({
    storage: options.storage || storage,
    fileFilter: options.fileFilter || imageFileFilter,
    limits: options.limits || limits
  });

  return upload;
};

// Single file upload
const uploadSingle = (fieldName) => {
  return createUploadMiddleware().single(fieldName);
};

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return createUploadMiddleware().array(fieldName, maxCount);
};

// Mixed fields upload
const uploadFields = (fields) => {
  return createUploadMiddleware().fields(fields);
};

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size exceeds the maximum limit of 5MB';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
    }
    
    return res.status(400).json({
      success: false,
      code: 'UPLOAD_ERROR',
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};

module.exports = {
  createUploadMiddleware,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError
};
