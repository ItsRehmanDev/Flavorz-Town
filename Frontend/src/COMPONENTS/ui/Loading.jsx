import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Component
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Loader size (sm, md, lg, xl)
 * @param {string} [props.variant='spinner'] - Loader variant (spinner, dots, pulse, skeleton)
 * @param {string} [props.color='primary'] - Loader color
 * @param {string} [props.text] - Loading text
 * @param {boolean} [props.isFullScreen=false] - Full screen overlay
 * @param {boolean} [props.isOverlay=false] - Overlay mode
 * @param {string} [props.className] - Additional classes
 */
const Loading = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  isFullScreen = false,
  isOverlay = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const colorMap = {
    primary: 'var(--color-primary-500)',
    secondary: 'var(--color-secondary-500)',
    white: '#ffffff',
    gray: 'var(--color-gray-400)',
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  };

  const fullScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-overlay)',
    backdropFilter: 'blur(4px)',
    zIndex: 'var(--z-modal)',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 10,
  };

  const textStyle = {
    fontSize: size === 'sm' ? 'var(--text-xs)' : size === 'md' ? 'var(--text-sm)' : 'var(--text-base)',
    color: 'var(--text-secondary)',
    fontWeight: 'var(--font-medium)',
  };

  const renderSpinner = () => (
    <div
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `${spinnerSize * 0.15}px solid transparent`,
        borderTopColor: spinnerColor,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );

  const renderDots = () => (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: spinnerSize * 0.25,
            height: spinnerSize * 0.25,
            backgroundColor: spinnerColor,
            borderRadius: '50%',
            animation: `loadingDots 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      style={{
        width: spinnerSize,
        height: spinnerSize,
        backgroundColor: spinnerColor,
        borderRadius: '50%',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
  );

  const renderSkeleton = () => (
    <div style={{ width: '100%', maxWidth: '200px' }}>
      <div
        className="skeleton"
        style={{
          height: spinnerSize,
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.5rem',
        }}
      />
      <div
        className="skeleton"
        style={{
          height: spinnerSize * 0.6,
          width: '60%',
          borderRadius: 'var(--radius-md)',
        }}
      />
    </div>
  );

  const variants = {
    spinner: renderSpinner,
    dots: renderDots,
    pulse: renderPulse,
    skeleton: renderSkeleton,
  };

  const wrapperStyle = isFullScreen
    ? { ...containerStyle, ...fullScreenStyle }
    : isOverlay
    ? { ...containerStyle, ...overlayStyle }
    : containerStyle;

  return (
    <div className={`loading loading-${variant} loading-${size} ${className}`} style={wrapperStyle}>
      {variants[variant]()}
      {text && <span style={textStyle}>{text}</span>}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'skeleton']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'gray']),
  text: PropTypes.string,
  isFullScreen: PropTypes.bool,
  isOverlay: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading;
