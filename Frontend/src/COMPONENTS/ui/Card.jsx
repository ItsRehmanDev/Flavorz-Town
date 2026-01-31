import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant='default'] - Card variant (default, outlined, elevated)
 * @param {string} [props.padding='md'] - Padding size (none, sm, md, lg)
 * @param {React.ReactNode} [props.header] - Card header
 * @param {React.ReactNode} [props.footer] - Card footer
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.isHoverable=false] - Hover effect
 * @param {string} [props.className] - Additional classes
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  onClick,
  isHoverable = false,
  className = '',
  ...rest
}) => {
  const baseStyles = {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    transition: 'all var(--transition-base)',
    cursor: onClick ? 'pointer' : 'default',
  };

  const variantStyles = {
    default: {
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
    },
    outlined: {
      border: '1px solid var(--border-medium)',
      boxShadow: 'none',
    },
    elevated: {
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-lg)',
    },
  };

  const paddingStyles = {
    none: {
      padding: 0,
    },
    sm: {
      padding: '0.75rem',
    },
    md: {
      padding: '1.25rem',
    },
    lg: {
      padding: '1.5rem',
    },
  };

  const hoverStyles = isHoverable ? {
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-xl)',
    },
  } : {};

  const cardStyle = {
    ...baseStyles,
    ...variantStyles[variant],
  };

  const contentStyle = {
    ...paddingStyles[padding],
  };

  const headerStyle = {
    padding: padding === 'none' ? '0 0 0.75rem 0' : '0 0 1rem 0',
    borderBottom: '1px solid var(--border-light)',
    marginBottom: padding === 'none' ? '0.75rem' : '1rem',
  };

  const footerStyle = {
    padding: padding === 'none' ? '0.75rem 0 0 0' : '1rem 0 0 0',
    borderTop: '1px solid var(--border-light)',
    marginTop: padding === 'none' ? '0.75rem' : '1rem',
  };

  return (
    <div
      className={`card card-${variant} ${isHoverable ? 'card-hoverable' : ''} ${className}`}
      style={cardStyle}
      onClick={onClick}
      {...rest}
    >
      {header && (
        <div className="card-header" style={headerStyle}>
          {header}
        </div>
      )}
      <div className="card-content" style={contentStyle}>
        {children}
      </div>
      {footer && (
        <div className="card-footer" style={footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  header: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  isHoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
