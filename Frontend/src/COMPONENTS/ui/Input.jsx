import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {Function} [props.onFocus] - Focus handler
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {React.ReactNode} [props.leftIcon] - Left icon
 * @param {React.ReactNode} [props.rightIcon] - Right icon
 * @param {boolean} [props.isRequired=false] - Required field
 * @param {boolean} [props.isDisabled=false] - Disabled state
 * @param {boolean} [props.isReadOnly=false] - Read-only state
 * @param {string} [props.size='md'] - Input size (sm, md, lg)
 * @param {string} [props.className] - Additional classes
 */
const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  size = 'md',
  className = '',
  ...rest
}, ref) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    width: '100%',
  };

  const labelStyle = {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    color: error ? 'var(--color-error)' : 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
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
      padding: '0.75rem 1rem',
      fontSize: 'var(--text-lg)',
      height: '48px',
    },
  };

  const inputStyle = {
    width: '100%',
    border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-medium)'}`,
    borderRadius: 'var(--radius-lg)',
    backgroundColor: isDisabled ? 'var(--color-gray-100)' : 'var(--bg-primary)',
    color: isDisabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
    transition: 'all var(--transition-base)',
    outline: 'none',
    paddingLeft: leftIcon ? '2.5rem' : sizeStyles[size].padding,
    paddingRight: rightIcon ? '2.5rem' : sizeStyles[size].padding,
    ...sizeStyles[size],
  };

  const iconStyle = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: error ? 'var(--color-error)' : 'var(--text-tertiary)',
    pointerEvents: 'none',
  };

  const leftIconStyle = {
    ...iconStyle,
    left: '0.75rem',
  };

  const rightIconStyle = {
    ...iconStyle,
    right: '0.75rem',
  };

  const helperTextStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--color-error)' : 'var(--text-muted)',
    marginTop: '0.25rem',
  };

  return (
    <div className={`input-group ${className}`} style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {isRequired && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <div style={inputContainerStyle}>
        {leftIcon && (
          <span style={leftIconStyle} className="input-icon-left">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          style={inputStyle}
          className={`input input-${size} ${error ? 'input-error' : ''}`}
          {...rest}
        />
        {rightIcon && (
          <span style={rightIconStyle} className="input-icon-right">
            {rightIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <span style={helperTextStyle} className="input-helper">
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Input;
