const productService = require('../services/productService');
const ApiResponse = require('../utils/response');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const result = await productService.getAllProducts(req.query);
      ApiResponse.paginated(res, result.products, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      ApiResponse.success(res, { product });
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug);
      ApiResponse.success(res, { product });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const images = req.files || [];
      
      const product = await productService.createProduct(productData, images);
      ApiResponse.created(res, { product }, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const newImages = req.files || [];
      const removedImageIds = req.body.removedImageIds || [];
      
      const product = await productService.updateProduct(id, updateData, newImages, removedImageIds);
      ApiResponse.success(res, { product }, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      ApiResponse.success(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedProducts(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const products = await productService.getFeaturedProducts(limit);
      ApiResponse.success(res, { products });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q } = req.query;
      const result = await productService.searchProducts(q, req.query);
      ApiResponse.success(res, { products: result.products });
    } catch (error) {
      next(error);
    }
  }

  async toggleFeatured(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.toggleFeatured(id);
      ApiResponse.success(res, { product }, 'Product featured status updated');
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req, res, next) {
    try {
      const { productIds, isActive } = req.body;
      const result = await productService.bulkUpdateStatus(productIds, isActive);
      ApiResponse.success(res, result, 'Products status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req, res, next) {
    try {
      const { productIds } = req.body;
      const result = await productService.bulkDelete(productIds);
      ApiResponse.success(res, result, 'Products deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getLowStockProducts(req, res, next) {
    try {
      const products = await productService.getLowStockProducts();
      ApiResponse.success(res, { products });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriesWithProductCount(req, res, next) {
    try {
      const categories = await productService.getCategoriesWithProductCount();
      ApiResponse.success(res, { categories });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
