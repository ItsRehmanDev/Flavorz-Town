import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

/**
 * Toast Context for managing toast notifications
 */
const ToastContext = createContext();

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Toast Container Component
 */
const ToastContainer = ({ toasts, onRemove }) => {
  const containerStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 'var(--z-toast)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: '400px',
  };

  return ReactDOM.createPortal(
    <div style={containerStyle} className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>,
    document.body
  );
};

/**
 * Individual Toast Component
 */
const Toast = ({ id, message, type, onRemove }) => {
  const typeStyles = {
    success: {
      backgroundColor: 'var(--color-success)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    error: {
      backgroundColor: 'var(--color-error)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
    warning: {
      backgroundColor: 'var(--color-warning)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    info: {
      backgroundColor: 'var(--color-info)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  };

  const style = typeStyles[type];

  const toastStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: style.backgroundColor,
    color: 'white',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideInRight var(--transition-base), fadeIn var(--transition-base)',
    minWidth: '300px',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    opacity: 0.8,
    transition: 'opacity var(--transition-fast)',
  };

  return (
    <div style={toastStyle} className={`toast toast-${type}`} role="alert">
      {style.icon}
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onRemove}
        style={closeButtonStyle}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.8')}
        aria-label="Close toast"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

export default ToastProvider;
