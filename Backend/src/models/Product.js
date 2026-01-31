const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price cannot exceed $10,000'],
    set: val => Math.round(val * 100) / 100
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    validate: {
      validator: function(val) {
        return val > this.price;
      },
      message: 'Compare price must be greater than the regular price'
    }
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
    select: false // Only visible to admin
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: {
      type: String,
      default: function() {
        return this.name;
      }
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  dietary: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isDairyFree: { type: Boolean, default: false },
    isNutFree: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false }
  },
  ingredients: [{
    type: String,
    trim: true,
    maxlength: [100, 'Ingredient cannot exceed 100 characters']
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number, // grams
    carbs: Number, // grams
    fat: Number, // grams
    sodium: Number // mg
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Threshold cannot be negative']
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: val => Math.round(val * 10) / 10
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Count cannot be negative']
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: {
      type: String,
      maxlength: [70, 'SEO title cannot exceed 70 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackInventory) return 'in_stock';
  if (this.inventory.quantity === 0) return 'out_of_stock';
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ sortOrder: 1 });

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Ensure at least one image is primary
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

// Calculate rating average before saving
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = total / this.ratings.count;
    this.ratings.count = this.reviews.length;
    
    // Update distribution
    this.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      this.ratings.distribution[review.rating]++;
    });
  }
  next();
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
