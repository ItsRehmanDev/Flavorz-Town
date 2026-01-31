const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');

const { authMiddleware, authorize } = require('../middlewares/auth');
const { authLimiter, apiLimiter } = require('../middlewares/security');
const { validateBody, validateParams, validateQuery } = require('../middlewares/validation');
const { uploadMultiple } = require('../middlewares/upload');

const {
  registerSchema,
  loginSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  createProductSchema,
  updateProductSchema
} = require('../validators');

// ============================================================================
// AUTH ROUTES
// ============================================================================
router.post('/auth/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/auth/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/auth/logout', authMiddleware, authController.logout);
router.post('/auth/refresh', authController.refreshToken);
router.get('/auth/me', authMiddleware, authController.getMe);
router.patch('/auth/profile', authMiddleware, authController.updateProfile);
router.patch('/auth/change-password', authMiddleware, authController.changePassword);
router.post('/auth/addresses', authMiddleware, authController.addAddress);
router.patch('/auth/addresses/:addressId', authMiddleware, authController.updateAddress);
router.delete('/auth/addresses/:addressId', authMiddleware, authController.deleteAddress);

// ============================================================================
// PRODUCT ROUTES - Public
// ============================================================================
router.get('/products', apiLimiter, productController.getAllProducts);
router.get('/products/featured', apiLimiter, productController.getFeaturedProducts);
router.get('/products/search', apiLimiter, productController.searchProducts);
router.get('/products/categories/count', apiLimiter, productController.getCategoriesWithProductCount);
router.get('/products/:id', apiLimiter, productController.getProductById);
router.get('/products/slug/:slug', apiLimiter, productController.getProductBySlug);

// ============================================================================
// PRODUCT ROUTES - Admin
// ============================================================================
router.post('/admin/products', 
  authMiddleware, 
  authorize('admin', 'manager'),
  uploadMultiple('images', 5),
  validateBody(createProductSchema),
  productController.createProduct
);

router.patch('/admin/products/:id', 
  authMiddleware, 
  authorize('admin', 'manager'),
  uploadMultiple('images', 5),
  productController.updateProduct
);

router.delete('/admin/products/:id', 
  authMiddleware, 
  authorize('admin', 'manager'),
  productController.deleteProduct
);

router.patch('/admin/products/:id/featured', 
  authMiddleware, 
  authorize('admin', 'manager'),
  productController.toggleFeatured
);

router.post('/admin/products/bulk/status', 
  authMiddleware, 
  authorize('admin', 'manager'),
  productController.bulkUpdateStatus
);

router.post('/admin/products/bulk/delete', 
  authMiddleware, 
  authorize('admin', 'manager'),
  productController.bulkDelete
);

router.get('/admin/products/low-stock', 
  authMiddleware, 
  authorize('admin', 'manager'),
  productController.getLowStockProducts
);

// ============================================================================
// ORDER ROUTES - User
// ============================================================================
router.post('/orders', 
  authMiddleware, 
  validateBody(createOrderSchema),
  orderController.createOrder
);

router.get('/orders/my-orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.patch('/orders/:id/cancel', authMiddleware, orderController.cancelOrder);

// ============================================================================
// ORDER ROUTES - Admin
// ============================================================================
router.get('/admin/orders', 
  authMiddleware, 
  authorize('admin', 'manager'),
  orderController.getAllOrders
);

router.patch('/admin/orders/:id/status', 
  authMiddleware, 
  authorize('admin', 'manager'),
  validateBody(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

router.get('/admin/orders/dashboard-stats', 
  authMiddleware, 
  authorize('admin', 'manager'),
  orderController.getDashboardStatistics
);

router.get('/admin/orders/sales-report', 
  authMiddleware, 
  authorize('admin', 'manager'),
  orderController.getSalesReport
);

router.delete('/admin/orders/:id', 
  authMiddleware, 
  authorize('admin'),
  orderController.deleteOrder
);

// ============================================================================
// USER ROUTES - Admin
// ============================================================================
router.get('/admin/users', 
  authMiddleware, 
  authorize('admin', 'manager'),
  userController.getAllUsers
);

router.get('/admin/users/:id', 
  authMiddleware, 
  authorize('admin', 'manager'),
  userController.getUserById
);

router.patch('/admin/users/:id/role', 
  authMiddleware, 
  authorize('admin'),
  userController.updateUserRole
);

router.patch('/admin/users/:id/toggle-active', 
  authMiddleware, 
  authorize('admin', 'manager'),
  userController.toggleUserActive
);

router.get('/admin/users/statistics', 
  authMiddleware, 
  authorize('admin', 'manager'),
  userController.getUserStatistics
);

module.exports = router;
