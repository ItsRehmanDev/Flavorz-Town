import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AdminLayout Component
 * Layout wrapper for admin pages with sidebar navigation
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.title] - Page title
 */
const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      ),
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: isSidebarOpen ? 'var(--sidebar-width)' : '72px',
    backgroundColor: 'var(--bg-dark)',
    color: 'white',
    transition: 'width var(--transition-base)',
    zIndex: 'var(--z-fixed)',
    display: 'flex',
    flexDirection: 'column',
  };

  const logoStyle = {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isSidebarOpen ? 'space-between' : 'center',
  };

  const menuStyle = {
    flex: 1,
    padding: '1rem 0',
    overflowY: 'auto',
  };

  const menuItemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: isSidebarOpen ? '0.75rem 1.25rem' : '0.75rem',
    margin: '0 0.75rem',
    borderRadius: 'var(--radius-lg)',
    textDecoration: 'none',
    color: active ? 'white' : 'var(--color-gray-400)',
    backgroundColor: active ? 'var(--color-primary-600)' : 'transparent',
    transition: 'all var(--transition-fast)',
    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
  });

  const footerStyle = {
    padding: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const mainStyle = {
    marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : '72px',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-secondary)',
    transition: 'margin-left var(--transition-base)',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--bg-primary)',
    padding: '1rem 1.5rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle} className="admin-sidebar">
        <div style={logoStyle}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary-500)" />
              <path d="M8 16c0-4 3-8 8-8s8 4 8 8-3 8-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="16" r="3" fill="white" />
            </svg>
            {isSidebarOpen && (
              <span style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)', color: 'white' }}>
                Admin
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-400)',
              cursor: 'pointer',
              display: isSidebarOpen ? 'block' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
          </button>
        </div>

        <nav style={menuStyle}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={menuItemStyle(isActive(item.path))}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              title={!isSidebarOpen ? item.label : undefined}
            >
              {item.icon}
              {isSidebarOpen && (
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div style={footerStyle}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-400)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-lg)',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            }}
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {isSidebarOpen && <span style={{ fontSize: 'var(--text-sm)' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainStyle} className="admin-main">
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              {isSidebarOpen && (
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                  {user?.name || 'Admin'}
                </span>
              )}
            </div>
          </div>
        </header>

        <div style={{ padding: '1.5rem' }}>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
