import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/feedback/Toast';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loading from './components/ui/Loading';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route wrapper (redirect if logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout with Header and Footer
const MainLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Simple layout for auth pages
const AuthLayout = () => (
  <Outlet />
);

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Menu />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>Checkout</h1>
              <p>Checkout page coming soon...</p>
            </div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminOrders />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>404</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Page not found</p>
        <a href="/" style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>Go home</a>
      </div>
    ),
  },
]);

/**
 * Main App Component
 */
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} fallbackElement={<Loading isFullScreen text="Loading..." />} />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
