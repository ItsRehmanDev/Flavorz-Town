const BaseRepository = require('./baseRepository');
const Product = require('../models/Product');

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findBySlug(slug, options = {}) {
    return this.findOne({ slug }, options);
  }

  async findActive(options = {}) {
    return this.find({ isActive: true }, options);
  }

  async findByCategory(categoryId, options = {}) {
    return this.find(
      { category: categoryId, isActive: true },
      options
    );
  }

  async search(query, options = {}) {
    const searchFilter = {
      isActive: true,
      $text: { $search: query }
    };

    const searchOptions = {
      ...options,
      sort: { score: { $meta: 'textScore' }, ...options.sort }
    };

    return this.find(searchFilter, searchOptions);
  }

  async findFeatured(limit = 8) {
    return this.find(
      { isActive: true, isFeatured: true },
      { limit, sort: { sortOrder: 1, createdAt: -1 } }
    );
  }

  async findWithFilters(filters = {}, options = {}) {
    const query = { isActive: true };

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    // Dietary filters
    if (filters.dietary) {
      const dietaryFilters = Array.isArray(filters.dietary) 
        ? filters.dietary 
        : [filters.dietary];
      
      dietaryFilters.forEach(diet => {
        if (['isVegetarian', 'isVegan', 'isGlutenFree', 'isDairyFree', 'isNutFree', 'isSpicy'].includes(diet)) {
          query[`dietary.${diet}`] = true;
        }
      });
    }

    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      query.tags = { $in: tags.map(tag => tag.toLowerCase()) };
    }

    // Search text
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Stock filter
    if (filters.inStock === 'true') {
      query['inventory.quantity'] = { $gt: 0 };
    }

    return this.paginate(query, options);
  }

  async updateStock(productId, quantity, session = null) {
    const updateOptions = session ? { session } : {};
    
    return this.model.findByIdAndUpdate(
      productId,
      { $inc: { 'inventory.quantity': quantity } },
      { new: true, ...updateOptions }
    );
  }

  async decreaseStock(productId, quantity, session = null) {
    const product = await this.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.inventory.trackInventory && product.inventory.quantity < quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    return this.updateStock(productId, -quantity, session);
  }

  async incrementViews(productId) {
    return this.model.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  async incrementSales(productId, quantity = 1) {
    return this.model.findByIdAndUpdate(
      productId,
      { $inc: { sales: quantity } },
      { new: true }
    );
  }

  async addReview(productId, reviewData) {
    return this.model.findByIdAndUpdate(
      productId,
      { $push: { reviews: reviewData } },
      { new: true, runValidators: true }
    );
  }

  async getLowStockProducts(threshold = null) {
    const query = {
      isActive: true,
      'inventory.trackInventory': true,
      $expr: {
        $lte: ['$inventory.quantity', threshold || '$inventory.lowStockThreshold']
      }
    };

    return this.find(query, { sort: { 'inventory.quantity': 1 } });
  }

  async getTopSelling(limit = 10) {
    return this.find(
      { isActive: true },
      { limit, sort: { sales: -1 } }
    );
  }

  async toggleFeatured(productId) {
    const product = await this.findById(productId);
    if (!product) return null;

    return this.update(productId, { isFeatured: !product.isFeatured });
  }

  async bulkUpdateStatus(productIds, isActive) {
    return this.updateMany(
      { _id: { $in: productIds } },
      { isActive }
    );
  }

  async bulkDelete(productIds) {
    return this.deleteMany({ _id: { $in: productIds } });
  }

  async getCategoriesWithProductCount() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          name: '$category.name',
          count: 1
        }
      }
    ]);
  }
}

module.exports = new ProductRepository();
