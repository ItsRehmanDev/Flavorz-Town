const productRepository = require('../repositories/productRepository');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, ERROR_CODES } = require('../constants');
const { logger } = require('../utils/logger');

class ProductService {
  async createProduct(productData, images) {
    // Upload images to Cloudinary
    const uploadedImages = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await uploadToCloudinary(images[i].path, {
          folder: 'flavorz-town/products'
        });
        
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          isPrimary: i === 0,
          alt: productData.name,
          sortOrder: i
        });
      } catch (error) {
        logger.error('Image upload failed', { error: error.message });
        // Continue with other images
      }
    }

    if (uploadedImages.length === 0) {
      throw new AppError(
        ERROR_CODES.UPLOAD_ERROR,
        'Failed to upload product images',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const product = await productRepository.create({
      ...productData,
      images: uploadedImages
    });

    logger.info('Product created', { productId: product._id, name: product.name });

    return product;
  }

  async getAllProducts(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;

    const result = await productRepository.findWithFilters(query, {
      page,
      limit,
      populate: { path: 'category', select: 'name slug' }
    });

    return {
      products: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
        itemsPerPage: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    };
  }

  async getProductById(id) {
    const product = await productRepository.findById(id, {
      populate: { path: 'category', select: 'name slug' }
    });

    if (!product) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Product not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Increment views
    await productRepository.incrementViews(id);

    return product;
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug, {
      populate: { path: 'category', select: 'name slug' }
    });

    if (!product) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Product not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return product;
  }

  async updateProduct(id, updateData, newImages = [], removedImageIds = []) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Product not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    let images = [...product.images];

    // Remove deleted images
    if (removedImageIds.length > 0) {
      for (const publicId of removedImageIds) {
        await deleteFromCloudinary(publicId);
      }
      images = images.filter(img => !removedImageIds.includes(img.publicId));
    }

    // Upload new images
    if (newImages.length > 0) {
      const uploadedImages = [];
      
      for (let i = 0; i < newImages.length; i++) {
        try {
          const result = await uploadToCloudinary(newImages[i].path, {
            folder: 'flavorz-town/products'
          });
          
          uploadedImages.push({
            url: result.url,
            publicId: result.publicId,
            isPrimary: images.length === 0 && i === 0,
            alt: updateData.name || product.name,
            sortOrder: images.length + i
          });
        } catch (error) {
          logger.error('Image upload failed', { error: error.message });
        }
      }

      images = [...images, ...uploadedImages];
    }

    // Ensure at least one image is primary
    if (images.length > 0 && !images.some(img => img.isPrimary)) {
      images[0].isPrimary = true;
    }

    const updatedProduct = await productRepository.update(id, {
      ...updateData,
      images
    });

    logger.info('Product updated', { productId: id });

    return updatedProduct;
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Product not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    await productRepository.delete(id);

    logger.info('Product deleted', { productId: id });

    return { success: true };
  }

  async getFeaturedProducts(limit = 8) {
    return productRepository.findFeatured(limit);
  }

  async searchProducts(query, options = {}) {
    if (!query || query.trim().length < 2) {
      return { products: [], pagination: null };
    }

    return productRepository.search(query, {
      ...options,
      populate: { path: 'category', select: 'name' }
    });
  }

  async getLowStockProducts() {
    return productRepository.getLowStockProducts();
  }

  async toggleFeatured(id) {
    const product = await productRepository.toggleFeatured(id);

    if (!product) {
      throw new AppError(
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Product not found',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return product;
  }

  async bulkUpdateStatus(productIds, isActive) {
    await productRepository.bulkUpdateStatus(productIds, isActive);
    
    logger.info('Products bulk status updated', { 
      productIds, 
      isActive,
      count: productIds.length 
    });

    return { success: true, updatedCount: productIds.length };
  }

  async bulkDelete(productIds) {
    // Get all products to delete their images
    const products = await productRepository.find({
      _id: { $in: productIds }
    });

    // Delete images from Cloudinary
    for (const product of products) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }
      }
    }

    await productRepository.bulkDelete(productIds);
    
    logger.info('Products bulk deleted', { 
      productIds, 
      count: productIds.length 
    });

    return { success: true, deletedCount: productIds.length };
  }

  async getCategoriesWithProductCount() {
    return productRepository.getCategoriesWithProductCount();
  }
}

module.exports = new ProductService();
