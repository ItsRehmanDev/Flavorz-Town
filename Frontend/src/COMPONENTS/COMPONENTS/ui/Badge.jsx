import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.variant='default'] - Badge variant
 * @param {string} [props.size='md'] - Badge size
 * @param {string} [props.color='primary'] - Badge color
 * @param {React.ReactNode} [props.leftIcon] - Left icon
 * @param {React.ReactNode} [props.rightIcon] - Right icon
 * @param {boolean} [props.isPill=false] - Pill shape
 * @param {boolean} [props.isDot=false] - Dot only mode
 * @param {string} [props.className] - Additional classes
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  color = 'primary',
  leftIcon,
  rightIcon,
  isPill = false,
  isDot = false,
  className = '',
  ...rest
}) => {
  const sizeStyles = {
    sm: {
      padding: isDot ? '4px' : '2px 8px',
      fontSize: 'var(--text-xs)',
      height: isDot ? '8px' : 'auto',
      minHeight: '18px',
    },
    md: {
      padding: isDot ? '6px' : '4px 10px',
      fontSize: 'var(--text-xs)',
      height: isDot ? '10px' : 'auto',
      minHeight: '22px',
    },
    lg: {
      padding: isDot ? '8px' : '6px 12px',
      fontSize: 'var(--text-sm)',
      height: isDot ? '12px' : 'auto',
      minHeight: '26px',
    },
  };

  const colorStyles = {
    primary: {
      default: {
        backgroundColor: 'var(--color-primary-100)',
        color: 'var(--color-primary-700)',
      },
      solid: {
        backgroundColor: 'var(--color-primary-500)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary-600)',
        border: '1px solid var(--color-primary-300)',
      },
      subtle: {
        backgroundColor: 'var(--color-primary-50)',
        color: 'var(--color-primary-600)',
      },
    },
    secondary: {
      default: {
        backgroundColor: 'var(--color-secondary-100)',
        color: 'var(--color-secondary-700)',
      },
      solid: {
        backgroundColor: 'var(--color-secondary-500)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-secondary-600)',
        border: '1px solid var(--color-secondary-300)',
      },
      subtle: {
        backgroundColor: 'var(--color-secondary-50)',
        color: 'var(--color-secondary-600)',
      },
    },
    success: {
      default: {
        backgroundColor: 'var(--color-success-light)',
        color: 'var(--color-success)',
      },
      solid: {
        backgroundColor: 'var(--color-success)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-success)',
        border: '1px solid var(--color-success)',
      },
      subtle: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--color-success)',
      },
    },
    warning: {
      default: {
        backgroundColor: 'var(--color-warning-light)',
        color: 'var(--color-warning)',
      },
      solid: {
        backgroundColor: 'var(--color-warning)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-warning)',
        border: '1px solid var(--color-warning)',
      },
      subtle: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: 'var(--color-warning)',
      },
    },
    error: {
      default: {
        backgroundColor: 'var(--color-error-light)',
        color: 'var(--color-error)',
      },
      solid: {
        backgroundColor: 'var(--color-error)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-error)',
        border: '1px solid var(--color-error)',
      },
      subtle: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--color-error)',
      },
    },
    gray: {
      default: {
        backgroundColor: 'var(--color-gray-200)',
        color: 'var(--color-gray-700)',
      },
      solid: {
        backgroundColor: 'var(--color-gray-500)',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-gray-600)',
        border: '1px solid var(--color-gray-300)',
      },
      subtle: {
        backgroundColor: 'var(--color-gray-100)',
        color: 'var(--color-gray-600)',
      },
    },
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontWeight: 'var(--font-medium)',
    lineHeight: 1,
    borderRadius: isPill ? '9999px' : 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...colorStyles[color][variant],
  };

  return (
    <span
      className={`badge badge-${variant} badge-${size} badge-${color} ${isPill ? 'badge-pill' : ''} ${className}`}
      style={baseStyles}
      {...rest}
    >
      {!isDot && (
        <>
          {leftIcon && <span className="badge-icon-left" style={{ display: 'flex' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="badge-icon-right" style={{ display: 'flex' }}>{rightIcon}</span>}
        </>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'solid', 'outline', 'subtle']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'gray']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isPill: PropTypes.bool,
  isDot: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
