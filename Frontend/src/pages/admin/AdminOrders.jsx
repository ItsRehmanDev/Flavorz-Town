import React, { useState } from 'react';
import { adminOrderApi } from '../../api';
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../components/feedback/Toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/feedback/EmptyState';

/**
 * Admin Orders Page
 * Manage customer orders
 */
const AdminOrders = () => {
  const { orders, isLoading, error, pagination, setPage, refetch } = useOrders({ limit: 10 });
  const toast = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'preparing', label: 'Preparing', color: 'primary' },
    { value: 'ready', label: 'Ready', color: 'secondary' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
  ];

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

  const handleStatusClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      await adminOrderApi.updateStatus(selectedOrder._id, { status: newStatus });
      toast.success('Order status updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
      setStatusModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout title="Orders">
        <Loading isFullScreen={false} text="Loading orders..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '250px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-primary)' }}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {error ? (
        <EmptyState
          icon="error"
          title="Failed to load orders"
          description={error}
          actionLabel="Try Again"
          onAction={refetch}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="box"
          title="No orders found"
          description={searchQuery || statusFilter ? "No orders match your filters" : "No orders have been placed yet"}
          actionLabel={searchQuery || statusFilter ? "Clear Filters" : undefined}
          onAction={searchQuery || statusFilter ? () => { setSearchQuery(''); setStatusFilter(''); } : undefined}
        />
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Items</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Total</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{order.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--text-sm)' }}>
                    {order.items.length} items
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                    <button
                      onClick={() => handleStatusClick(order)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Badge size="md" color={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </button>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right' }}>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/orders/${order._id}`}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <Button variant="outline" size="sm" onClick={() => setPage(pagination.page - 1)} isDisabled={!pagination.hasPrevPage}>Previous</Button>
              <span style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>Page {pagination.page} of {pagination.totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(pagination.page + 1)} isDisabled={!pagination.hasNextPage}>Next</Button>
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setSelectedOrder(null); }}
        title={`Update Order Status - #${selectedOrder?._id.slice(-8).toUpperCase()}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setStatusModalOpen(false); setSelectedOrder(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateStatus} isLoading={isUpdating}>Update Status</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {statusOptions.map((status) => (
            <label
              key={status.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${newStatus === status.value ? `var(--color-${status.color}-500)` : 'var(--border-light)'}`,
                cursor: 'pointer',
                backgroundColor: newStatus === status.value ? `var(--color-${status.color}-50)` : 'var(--bg-primary)',
              }}
            >
              <input
                type="radio"
                name="status"
                value={status.value}
                checked={newStatus === status.value}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
              <Badge color={status.color}>{status.label}</Badge>
            </label>
          ))}
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
