import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Modal footer
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl, full)
 * @param {boolean} [props.closeOnOverlayClick=true] - Close on overlay click
 * @param {boolean} [props.showCloseButton=true] - Show close button
 * @param {boolean} [props.isCentered=true] - Center modal vertically
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  isCentered = true,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg-overlay)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: isCentered ? 'center' : 'flex-start',
    justifyContent: 'center',
    zIndex: 'var(--z-modal)',
    padding: isCentered ? '1rem' : '4rem 1rem 1rem',
    animation: 'fadeIn var(--transition-base)',
  };

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '500px' },
    lg: { maxWidth: '700px' },
    xl: { maxWidth: '900px' },
    full: { maxWidth: '95%', maxHeight: '95vh' },
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-2xl)',
    width: '100%',
    maxHeight: isCentered ? '90vh' : 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'scaleIn var(--transition-slow)',
    ...sizeStyles[size],
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-light)',
  };

  const titleStyle = {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--text-primary)',
    margin: 0,
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-tertiary)',
    transition: 'all var(--transition-fast)',
  };

  const contentStyle = {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1,
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-secondary)',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={handleOverlayClick} className="modal-overlay">
      <div style={modalStyle} className="modal" role="dialog" aria-modal="true">
        {(title || showCloseButton) && (
          <div style={headerStyle} className="modal-header">
            {title && <h3 style={titleStyle}>{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-gray-100)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-tertiary)';
                }}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div style={contentStyle} className="modal-content">
          {children}
        </div>
        {footer && (
          <div style={footerStyle} className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  isCentered: PropTypes.bool,
};

export default Modal;
