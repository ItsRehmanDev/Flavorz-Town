const cloudinary = require('cloudinary').v2;
const config = require('./env');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

const uploadToCloudinary = async (filePath, options = {}) => {
  const defaultOptions = {
    folder: 'flavorz-town',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  };

  const uploadOptions = { ...defaultOptions, ...options };

  try {
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
