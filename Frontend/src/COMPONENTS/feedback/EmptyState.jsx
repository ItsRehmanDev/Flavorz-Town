import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';

/**
 * EmptyState Component
 * Displays a message when there's no data to show
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.icon] - Custom icon
 * @param {string} [props.title='No data found'] - Title text
 * @param {string} [props.description] - Description text
 * @param {string} [props.actionLabel] - Action button label
 * @param {Function} [props.onAction] - Action button handler
 * @param {string} [props.size='md'] - Size variant
 */
const EmptyState = ({
  icon,
  title = 'No data found',
  description,
  actionLabel,
  onAction,
  size = 'md',
}) => {
  const defaultIcons = {
    search: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    box: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    cart: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    order: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    error: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    default: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    ),
  };

  const sizeStyles = {
    sm: {
      padding: '2rem',
      iconSize: 48,
    },
    md: {
      padding: '3rem',
      iconSize: 64,
    },
    lg: {
      padding: '4rem',
      iconSize: 80,
    },
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: sizeStyles[size].padding,
    color: 'var(--text-secondary)',
  };

  const iconStyle = {
    color: 'var(--text-tertiary)',
    marginBottom: '1.5rem',
  };

  const titleStyle = {
    fontSize: size === 'sm' ? 'var(--text-lg)' : size === 'md' ? 'var(--text-xl)' : 'var(--text-2xl)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    fontSize: size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    marginBottom: actionLabel ? '1.5rem' : '0',
    lineHeight: '1.5',
  };

  const displayIcon = typeof icon === 'string' ? defaultIcons[icon] || defaultIcons.default : icon || defaultIcons.default;

  return (
    <div style={containerStyle} className="empty-state">
      <div style={iconStyle} className="empty-state-icon">
        {displayIcon}
      </div>
      <h3 style={titleStyle} className="empty-state-title">
        {title}
      </h3>
      {description && (
        <p style={descriptionStyle} className="empty-state-description">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size={size === 'sm' ? 'sm' : 'md'}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.oneOf(['search', 'box', 'cart', 'order', 'error', 'default'])]),
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default EmptyState;
