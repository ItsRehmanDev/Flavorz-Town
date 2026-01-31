import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { adminProductApi } from '../../api';
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
 * Admin Products Page
 * Manage products inventory
 */
const AdminProducts = () => {
  const { products, isLoading, error, pagination, setPage, refetch } = useProducts({ limit: 10 });
  const toast = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminProductApi.delete(productToDelete._id);
      toast.success('Product deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await adminProductApi.toggleFeatured(product._id);
      toast.success(`Product ${product.isFeatured ? 'removed from' : 'marked as'} featured`);
      refetch();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout title="Products">
        <Loading isFullScreen={false} text="Loading products..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px' }}
        />
        <Button variant="primary" onClick={() => window.location.href = '/admin/products/new'}>
          + Add Product
        </Button>
      </div>

      {error ? (
        <EmptyState
          icon="error"
          title="Failed to load products"
          description={error}
          actionLabel="Try Again"
          onAction={refetch}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon="box"
          title="No products found"
          description={searchQuery ? "No products match your search" : "Get started by adding your first product"}
          actionLabel={searchQuery ? "Clear Search" : "Add Product"}
          onAction={searchQuery ? () => setSearchQuery('') : () => window.location.href = '/admin/products/new'}
        />
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Stock</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '2px solid var(--border-light)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={product.images?.[0]?.url || '/placeholder-food.jpg'}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{product.name}</div>
                        {product.isFeatured && <Badge size="sm" color="primary" isPill>Featured</Badge>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {product.category?.name || 'Uncategorized'}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--text-sm)' }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                    <Badge size="sm" color={product.isActive ? 'success' : 'gray'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: product.isFeatured ? 'var(--color-primary-500)' : 'var(--text-tertiary)' }}
                        title="Toggle Featured"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={product.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => window.location.href = `/admin/products/edit/${product._id}`}
                        style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-info)' }}
                        title="Edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
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
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setProductToDelete(null); }}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteModalOpen(false); setProductToDelete(null); }}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete} isLoading={isDeleting}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</p>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
