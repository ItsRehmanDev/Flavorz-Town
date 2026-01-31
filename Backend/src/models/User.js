const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  addresses: [{
    label: {
      type: String,
      default: 'Home'
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Zip code cannot exceed 20 characters']
    },
    country: {
      type: String,
      default: 'USA',
      trim: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    device: String,
    ipAddress: String
  }],
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name (if we want to add firstName/lastName later)
userSchema.virtual('displayName').get(function() {
  return this.name;
});

// Virtual to populate orders
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
  options: { sort: { createdAt: -1 } }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Ensure only one default address per user
userSchema.pre('save', function(next) {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length === 0) {
      this.addresses[0].isDefault = true;
    } else if (defaultAddresses.length > 1) {
      // Keep only the first one as default
      this.addresses.forEach((addr, index) => {
        if (index > 0) addr.isDefault = false;
      });
    }
  }
  next();
});

// Remove password from JSON output
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  }
});

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
