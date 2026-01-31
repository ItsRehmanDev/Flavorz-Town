import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/feedback/Toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
import EmptyState from '../components/feedback/EmptyState';
import Modal from '../components/ui/Modal';

/**
 * Orders Page Component
 * Display user's order history
 */
const Orders = () => {
  const { orders, isLoading, error, pagination, setPage, cancelOrder, refetch } = useOrders();
  const { clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'secondary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'gray';
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      await cancelOrder(selectedOrder._id, cancelReason);
      toast.success('Order cancelled successfully');
      setCancelModalOpen(false);
      setCancelReason('');
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleReorder = (order) => {
    // Add items from order to cart
    order.items.forEach((item) => {
      // This would need to be implemented in CartContext
      console.log('Reordering:', item);
    });
    toast.success('Items added to cart');
    navigate('/cart');
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-secondary)',
    paddingTop: 'var(--header-height)',
  };

  const mainStyle = {
    flex: 1,
    maxWidth: 'var(--container-lg)',
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
  };

  const titleStyle = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--text-primary)',
    marginBottom: '2rem',
  };

  const ordersListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const orderCardStyle = {
    padding: '1.5rem',
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const orderInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const orderIdStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  };

  const orderDateStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  };

  const itemsListStyle = {
    borderTop: '1px solid var(--border-light)',
    borderBottom: '1px solid var(--border-light)',
    padding: '1rem 0',
    marginBottom: '1rem',
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  };

  const orderFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  };

  const totalStyle = {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-primary-600)',
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
  };

  if (isLoading && orders.length === 0) {
    return (
      <div style={containerStyle}>
        <Header />
        <main style={mainStyle}>
          <Loading isFullScreen={false} text="Loading orders..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Header />
      
      <main style={mainStyle}>
        <h1 style={titleStyle}>My Orders</h1>

        {error ? (
          <EmptyState
            icon="error"
            title="Failed to load orders"
            description={error}
            actionLabel="Try Again"
            onAction={refetch}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="box"
            title="No orders yet"
            description="You haven't placed any orders yet. Start exploring our menu!"
            actionLabel="Browse Menu"
            onAction={() => navigate('/menu')}
          />
        ) : (
          <>
            <div style={ordersListStyle}>
              {orders.map((order) => (
                <Card key={order._id} style={orderCardStyle}>
                  <div style={orderHeaderStyle}>
                    <div style={orderInfoStyle}>
                      <span style={orderIdStyle}>Order #{order._id.slice(-8).toUpperCase()}</span>
                      <span style={orderDateStyle}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Badge color={getStatusColor(order.status)} size="md">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div style={itemsListStyle}>
                    {order.items.map((item, index) => (
                      <div key={index} style={itemStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 'var(--font-semibold)' }}>
                            {item.quantity}x
                          </span>
                          <span>{item.name}</span>
                        </div>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={orderFooterStyle}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Total
                      </span>
                      <div style={totalStyle}>${order.total.toFixed(2)}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(order)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        Reorder
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div style={paginationStyle}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page - 1)}
                  isDisabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                
                <span style={{ padding: '0 1rem', fontWeight: 'var(--font-medium)' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page + 1)}
                  isDisabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setCancelReason('');
          setSelectedOrder(null);
        }}
        title="Cancel Order"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCancelModalOpen(false);
                setCancelReason('');
                setSelectedOrder(null);
              }}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              isLoading={cancellingOrderId === selectedOrder?._id}
            >
              Cancel Order
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <textarea
          placeholder="Please provide a reason for cancellation (required)"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            fontFamily: 'inherit',
            fontSize: 'var(--text-base)',
            resize: 'vertical',
          }}
        />
      </Modal>
    </div>
  );
};

export default Orders;
