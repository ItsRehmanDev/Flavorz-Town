const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } = require('../constants');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  },
  options: [{
    name: String,
    value: String,
    priceModifier: {
      type: Number,
      default: 0
    }
  }]
}, { _id: true });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  orderNumber: {
    type: String,
    unique: true,
    index: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  payment: {
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.COD
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    transactionId: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    refundReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Refund reason cannot exceed 500 characters']
    }
  },
  shipping: {
    address: {
      label: {
        type: String,
        default: 'Home'
      },
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      zipCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        default: 'USA'
      }
    },
    method: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    },
    trackingNumber: {
      type: String,
      trim: true
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    taxRate: {
      type: Number,
      default: 0.08,
      min: 0,
      max: 1
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  notes: {
    customer: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    internal: {
      type: String,
      trim: true,
      maxlength: [1000, 'Internal note cannot exceed 1000 characters'],
      select: false // Only visible to admin
    }
  },
  cancelReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Cancel reason cannot exceed 500 characters']
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for status display
orderSchema.virtual('statusDisplay').get(function() {
  return this.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ isActive: 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const prefix = 'FT';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = String(count + 1).padStart(6, '0');
    this.orderNumber = `${prefix}-${date}-${sequence}`;
  }
  
  // Add initial status to history
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  
  // Set cancellation date if status changes to cancelled
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  if (!Object.values(ORDER_STATUS).includes(newStatus)) {
    throw new Error('Invalid order status');
  }
  
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy,
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getStatistics = async function(dateRange = {}) {
  const matchStage = {};
  
  if (dateRange.start || dateRange.end) {
    matchStage.createdAt = {};
    if (dateRange.start) matchStage.createdAt.$gte = new Date(dateRange.start);
    if (dateRange.end) matchStage.createdAt.$lte = new Date(dateRange.end);
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        avgOrderValue: { $avg: '$pricing.total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);
