/**
 * FLAVORZ TOWN - Frontend Component & Hook Exports
 * Centralized exports for all UI components, hooks, and utilities
 */

// UI Components
export { default as Button } from './components/ui/Button';
export { default as Input } from './components/ui/Input';
export { default as Card } from './components/ui/Card';
export { default as Modal } from './components/ui/Modal';
export { default as Loading } from './components/ui/Loading';
export { default as Badge } from './components/ui/Badge';

// Layout Components
export { default as Header } from './components/layout/Header';
export { default as Footer } from './components/layout/Footer';
export { default as AdminLayout } from './components/layout/AdminLayout';

// Feedback Components
export { default as ToastProvider, useToast } from './components/feedback/Toast';
export { default as EmptyState } from './components/feedback/EmptyState';

// Contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { CartProvider, useCart } from './contexts/CartContext';

// Hooks
export { useAdminGuard, useAuthGuard, useGuestGuard } from './hooks/useAuth';
export { useProducts, useProduct } from './hooks/useProducts';
export { useOrders, useOrder } from './hooks/useOrders';
export { usePagination, usePaginationRange } from './hooks/usePagination';
export { useDebounce, useDebouncedCallback, useDebouncedSearch } from './hooks/useDebounce';

// API
export { default as api, authApi, productApi, adminProductApi, orderApi, adminOrderApi, adminUserApi } from './api';
