import React, { useState, useEffect } from 'react';
import { adminOrderApi } from '../../api';
import { useToast } from '../../components/feedback/Toast';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

/**
 * Admin Dashboard Page
 * Overview of store performance and metrics
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await adminOrderApi.getDashboardStats({ days: 30 });
        setStats(statsResponse.data.data);
        const ordersResponse = await adminOrderApi.getAll({ limit: 5, sort: '-createdAt' });
        setRecentOrders(ordersResponse.data.data.orders);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <Loading isFullScreen={false} text="Loading dashboard..." />
      </AdminLayout>
    );
  }

  const statsData = [
    {
      label: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      change: '+12%',
      color: 'success',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: '+8%',
      color: 'primary',
    },
    {
      label: 'Customers',
      value: stats?.totalCustomers || 0,
      change: '+15%',
      color: 'secondary',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      change: 'Active',
      color: 'warning',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statsData.map((stat, index) => (
          <Card key={index} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: `var(--color-${stat.color}-light)`, color: `var(--color-${stat.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
            </div>
            <Badge size="sm" color={stat.color}>{stat.change}</Badge>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card header={<h3 style={{ margin: 0 }}>Recent Orders</h3>}>
          {recentOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No orders yet
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-light)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ padding: '0.75rem', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-light)' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '0.75rem', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-light)' }}>{order.user?.name || 'Guest'}</td>
                    <td style={{ padding: '0.75rem', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-light)' }}>
                      <Badge size="sm" color={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-light)', fontWeight: 'var(--font-semibold)' }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card header={<h3 style={{ margin: 0 }}>Quick Actions</h3>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="/admin/products/new" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>+ Add New Product</span>
            </a>
            <a href="/admin/orders" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>View All Orders</span>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
