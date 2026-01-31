import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Badge from '../ui/Badge';

/**
 * Header Component
 * Main navigation header for the e-commerce application
 */
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/menu', label: 'Menu' },
    { path: '/orders', label: 'My Orders' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/orders', label: 'Orders' },
  ];

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-primary)',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
    zIndex: 'var(--z-fixed)',
    transition: 'all var(--transition-base)',
  };

  const containerStyle = {
    maxWidth: 'var(--container-xl)',
    margin: '0 auto',
    padding: '0 1rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  };

  const logoTextStyle = {
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-bold)',
    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  };

  const navLinkStyle = (isActive) => ({
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary-600)' : 'var(--text-primary)',
    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
    fontSize: 'var(--text-sm)',
    transition: 'color var(--transition-fast)',
    position: 'relative',
    ':hover': {
      color: 'var(--color-primary-600)',
    },
  });

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const iconButtonStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    transition: 'all var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--color-gray-100)',
      color: 'var(--color-primary-600)',
    },
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
  };

  const profileButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontWeight: 'var(--font-medium)',
    fontSize: 'var(--text-sm)',
    transition: 'all var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--color-gray-100)',
    },
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-500)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-bold)',
  };

  const mobileMenuButtonStyle = {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={headerStyle} className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle} className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--color-primary-500)"/>
            <path d="M8 16c0-4 3-8 8-8s8 4 8 8-3 8-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
          <span style={logoTextStyle}>Flavorz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={navStyle} className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={navLinkStyle(isActive(link.path))}
              className={isActive(link.path) ? 'nav-link-active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
          
          {user?.role === 'admin' && (
            <div style={{ position: 'relative' }}>
              <span style={{ ...navLinkStyle(false), cursor: 'pointer' }}>
                Admin
              </span>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: 'var(--bg-primary)',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.5rem 0',
                minWidth: '160px',
                display: 'none',
              }}>
                {adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      ':hover': {
                        backgroundColor: 'var(--color-gray-100)',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div style={actionsStyle}>
          {/* Cart Button */}
          <button
            onClick={toggleCart}
            style={iconButtonStyle}
            className="btn-cart"
            aria-label="Open cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m4 3l1.5 9m9.5-9v0a3 3 0 1 1 0 6m-8 0v0a3 3 0 1 0 0 6" />
            </svg>
            {totalItems > 0 && (
              <span style={cartBadgeStyle}>
                <Badge size="sm" color="primary" isPill>
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              </span>
            )}
          </button>

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={profileButtonStyle}
                className="btn-profile"
              >
                <div style={avatarStyle}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="profile-name" style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }}>
                  {user?.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.5rem 0',
                  minWidth: '180px',
                  zIndex: 1000,
                  animation: 'fadeInDown var(--transition-base)',
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                    <p style={{ margin: 0, fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {user?.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-gray-100)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-gray-100)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      style={{
                        display: 'block',
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        color: 'var(--color-primary-600)',
                        fontSize: 'var(--text-sm)',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-gray-100)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-error)',
                        fontSize: 'var(--text-sm)',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-error-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-primary-500)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                transition: 'all var(--transition-fast)',
              }}
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={mobileMenuButtonStyle}
            className="btn-mobile-menu"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-primary)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1rem',
          animation: 'fadeInDown var(--transition-base)',
        }} className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                textDecoration: 'none',
                color: isActive(link.path) ? 'var(--color-primary-600)' : 'var(--text-primary)',
                fontWeight: isActive(link.path) ? 'var(--font-semibold)' : 'var(--font-medium)',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '0.5rem 0', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Admin
              </div>
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0 0.75rem 1rem',
                    textDecoration: 'none',
                    color: isActive(link.path) ? 'var(--color-primary-600)' : 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
