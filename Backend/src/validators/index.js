const Joi = require('joi');

// ============================================================================
// AUTH VALIDATORS
// ============================================================================
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// ============================================================================
// PRODUCT VALIDATORS
// ============================================================================
const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  shortDescription: Joi.string().max(200).optional(),
  price: Joi.number().min(0).max(10000).required(),
  comparePrice: Joi.number().min(0).optional(),
  costPrice: Joi.number().min(0).optional(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  dietary: Joi.object({
    isVegetarian: Joi.boolean().optional(),
    isVegan: Joi.boolean().optional(),
    isGlutenFree: Joi.boolean().optional(),
    isDairyFree: Joi.boolean().optional(),
    isNutFree: Joi.boolean().optional(),
    isSpicy: Joi.boolean().optional()
  }).optional(),
  ingredients: Joi.array().items(Joi.string()).optional(),
  nutritionInfo: Joi.object({
    calories: Joi.number().min(0).optional(),
    protein: Joi.number().min(0).optional(),
    carbs: Joi.number().min(0).optional(),
    fat: Joi.number().min(0).optional(),
    sodium: Joi.number().min(0).optional()
  }).optional(),
  inventory: Joi.object({
    quantity: Joi.number().min(0).default(0),
    lowStockThreshold: Joi.number().min(0).default(5),
    sku: Joi.string().optional(),
    trackInventory: Joi.boolean().default(true)
  }).optional(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  sortOrder: Joi.number().default(0),
  seo: Joi.object({
    title: Joi.string().max(70).optional(),
    description: Joi.string().max(160).optional(),
    keywords: Joi.array().items(Joi.string()).optional()
  }).optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  shortDescription: Joi.string().max(200).optional(),
  price: Joi.number().min(0).max(10000).optional(),
  comparePrice: Joi.number().min(0).optional(),
  costPrice: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  dietary: Joi.object({
    isVegetarian: Joi.boolean().optional(),
    isVegan: Joi.boolean().optional(),
    isGlutenFree: Joi.boolean().optional(),
    isDairyFree: Joi.boolean().optional(),
    isNutFree: Joi.boolean().optional(),
    isSpicy: Joi.boolean().optional()
  }).optional(),
  ingredients: Joi.array().items(Joi.string()).optional(),
  nutritionInfo: Joi.object({
    calories: Joi.number().min(0).optional(),
    protein: Joi.number().min(0).optional(),
    carbs: Joi.number().min(0).optional(),
    fat: Joi.number().min(0).optional(),
    sodium: Joi.number().min(0).optional()
  }).optional(),
  inventory: Joi.object({
    quantity: Joi.number().min(0).optional(),
    lowStockThreshold: Joi.number().min(0).optional(),
    sku: Joi.string().optional(),
    trackInventory: Joi.boolean().optional()
  }).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  sortOrder: Joi.number().optional(),
  seo: Joi.object({
    title: Joi.string().max(70).optional(),
    description: Joi.string().max(160).optional(),
    keywords: Joi.array().items(Joi.string()).optional()
  }).optional(),
  removedImageIds: Joi.array().items(Joi.string()).optional()
});

// ============================================================================
// ORDER VALIDATORS
// ============================================================================
const orderItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).max(100).required(),
  options: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    value: Joi.string().required(),
    priceModifier: Joi.number().default(0)
  })).optional()
});

const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  shippingAddress: Joi.object({
    label: Joi.string().max(50).optional(),
    street: Joi.string().max(200).required(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).optional(),
    zipCode: Joi.string().max(20).optional(),
    country: Joi.string().max(100).optional()
  }).required(),
  paymentMethod: Joi.string().valid('cod', 'card', 'online').default('cod'),
  notes: Joi.string().max(500).optional()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ).required(),
  note: Joi.string().max(500).optional()
});

const cancelOrderSchema = Joi.object({
  reason: Joi.string().max(500).required()
});

// ============================================================================
// QUERY VALIDATORS
// ============================================================================
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  category: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().min(2).optional(),
  sort: Joi.string().valid('price_asc', 'price_desc', 'newest', 'popular', 'rating').optional(),
  dietary: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  tags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  inStock: Joi.string().valid('true', 'false').optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  createProductSchema,
  updateProductSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  paginationSchema,
  productQuerySchema
};
