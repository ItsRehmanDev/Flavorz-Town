import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline, ghost, danger)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {boolean} [props.isDisabled=false] - Disabled state
 * @param {boolean} [props.isFullWidth=false] - Full width button
 * @param {React.ReactNode} [props.leftIcon] - Left icon
 * @param {React.ReactNode} [props.rightIcon] - Right icon
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type
 * @param {string} [props.className] - Additional classes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 'var(--font-medium)',
    borderRadius: 'var(--radius-lg)',
    transition: 'all var(--transition-base)',
    cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: isDisabled || isLoading ? 0.6 : 1,
    width: isFullWidth ? '100%' : 'auto',
  };

  const sizeStyles = {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: 'var(--text-sm)',
      height: '32px',
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: 'var(--text-base)',
      height: '40px',
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: 'var(--text-lg)',
      height: '48px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary-500)',
      color: 'var(--text-inverse)',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary-500)',
      color: 'var(--text-inverse)',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary-500)',
      border: '2px solid var(--color-primary-500)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: 'none',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--text-inverse)',
      border: 'none',
    },
  };

  const hoverStyles = {
    primary: {
      ':hover': !isDisabled && !isLoading ? {
        backgroundColor: 'var(--color-primary-600)',
        transform: 'translateY(-1px)',
        boxShadow: 'var(--shadow-md)',
      } : {},
    },
    secondary: {
      ':hover': !isDisabled && !isLoading ? {
        backgroundColor: 'var(--color-secondary-600)',
        transform: 'translateY(-1px)',
        boxShadow: 'var(--shadow-md)',
      } : {},
    },
    outline: {
      ':hover': !isDisabled && !isLoading ? {
        backgroundColor: 'var(--color-primary-50)',
      } : {},
    },
    ghost: {
      ':hover': !isDisabled && !isLoading ? {
        backgroundColor: 'var(--color-gray-100)',
      } : {},
    },
    danger: {
      ':hover': !isDisabled && !isLoading ? {
        backgroundColor: '#dc2626',
        transform: 'translateY(-1px)',
        boxShadow: 'var(--shadow-md)',
      } : {},
    },
  };

  const buttonStyle = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`btn btn-${variant} btn-${size} ${className}`}
      style={buttonStyle}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="spinner" style={{
            width: size === 'sm' ? '14px' : size === 'md' ? '16px' : '20px',
            height: size === 'sm' ? '14px' : size === 'md' ? '16px' : '20px',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
