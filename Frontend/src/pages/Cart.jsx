import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/feedback/EmptyState';

/**
 * Cart Page Component
 * Shopping cart with item management and checkout
 */
const Cart = () => {
  const { items, totalItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const containerStyle = {
    minHeight: '100vh',
    maxWidth: 'var(--container-lg)',
    margin: '0 auto',
    padding: '2rem 1rem',
    paddingTop: 'calc(var(--header-height) + 2rem)',
  };

  const titleStyle = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--text-primary)',
    marginBottom: '2rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '2rem',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  };

  const itemsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const itemStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
  };

  const itemImageStyle = {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
  };

  const itemDetailsStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const itemNameStyle = {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--text-primary)',
  };

  const itemPriceStyle = {
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-primary-600)',
  };

  const quantityControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const quantityButtonStyle = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-medium)',
    backgroundColor: 'var(--bg-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  };

  const summaryStyle = {
    position: 'sticky',
    top: 'calc(var(--header-height) + 2rem)',
    height: 'fit-content',
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--border-light)',
  };

  const totalRowStyle = {
    ...summaryRowStyle,
    borderTop: '2px solid var(--border-medium)',
    borderBottom: 'none',
    marginTop: '0.5rem',
    paddingTop: '1rem',
  };

  if (items.length === 0) {
    return (
      <div style={containerStyle}>
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Looks like you haven't added any items yet. Browse our menu to find something delicious!"
          actionLabel="Browse Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        Shopping Cart
        <Badge size="md" color="primary" style={{ marginLeft: '1rem' }}>
          {totalItems} items
        </Badge>
      </h1>

      <div style={gridStyle}>
        <div style={itemsStyle}>
          {items.map((item) => (
            <div key={item.productId} style={itemStyle}>
              <img src={item.image} alt={item.name} style={itemImageStyle} />
              
              <div style={itemDetailsStyle}>
                <div>
                  <h3 style={itemNameStyle}>{item.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={quantityControlStyle}>
                    <button
                      style={quantityButtonStyle}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 'var(--font-semibold)', minWidth: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      style={quantityButtonStyle}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <span style={itemPriceStyle}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-error)',
                      padding: '0.5rem',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Button variant="ghost" onClick={clearCart} style={{ alignSelf: 'flex-start' }}>
            Clear Cart
          </Button>
        </div>

        <div style={summaryStyle}>
          <Card padding="lg">
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '1.5rem' }}>
              Order Summary
            </h3>
            
            <div style={summaryRowStyle}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 'var(--font-medium)' }}>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={summaryRowStyle}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Delivery Fee
                {deliveryFee === 0 && (
                  <Badge size="sm" color="success" style={{ marginLeft: '0.5rem' }}>
                    Free
                  </Badge>
                )}
              </span>
              <span style={{ fontWeight: 'var(--font-medium)' }}>
                {deliveryFee === 0 ? '$0.00' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            
            <div style={summaryRowStyle}>
              <span style={{ color: 'var(--text-secondary)' }}>Tax (8%)</span>
              <span style={{ fontWeight: 'var(--font-medium)' }}>${tax.toFixed(2)}</span>
            </div>
            
            <div style={totalRowStyle}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Total</span>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              isFullWidth
              onClick={() => navigate('/checkout')}
              style={{ marginTop: '1.5rem' }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="ghost"
              isFullWidth
              onClick={() => navigate('/menu')}
              style={{ marginTop: '0.75rem' }}
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
