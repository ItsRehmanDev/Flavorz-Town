import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/feedback/Toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
import EmptyState from '../components/feedback/EmptyState';
import Input from '../components/ui/Input';

/**
 * Menu Page Component
 * Browse and order food items
 */
const Menu = () => {
  const { products, isLoading, error, pagination, filters, setPage, updateFilters, resetFilters } = useProducts({ limit: 12 });
  const { addToCart } = useCart();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: '', name: 'All' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'specials', name: 'Specials' },
  ];

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    updateFilters({ search: e.target.value });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    updateFilters({ category: categoryId });
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
    maxWidth: 'var(--container-xl)',
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
  };

  const headerSectionStyle = {
    marginBottom: '2rem',
  };

  const titleStyle = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    fontSize: 'var(--text-lg)',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
  };

  const controlsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const categoriesStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  };

  const categoryButtonStyle = (isActive) => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-primary-500)' : 'var(--bg-primary)',
    color: isActive ? 'white' : 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    transition: 'all var(--transition-fast)',
    boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  };

  const productImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-lg)',
  };

  const productInfoStyle = {
    padding: '1rem 0',
  };

  const productNameStyle = {
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  };

  const productDescriptionStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const productFooterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const priceStyle = {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-primary-600)',
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '3rem',
  };

  const pageButtonStyle = (isActive, isDisabled) => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-primary-500)' : 'var(--bg-primary)',
    color: isActive ? 'white' : isDisabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    transition: 'all var(--transition-fast)',
    opacity: isDisabled ? 0.5 : 1,
    boxShadow: 'var(--shadow-sm)',
  });

  return (
    <div style={containerStyle}>
      <Header />
      
      <main style={mainStyle}>
        <div style={headerSectionStyle}>
          <h1 style={titleStyle}>Our Menu</h1>
          <p style={subtitleStyle}>Discover our delicious selection of dishes</p>
          
          <div style={controlsStyle}>
            <div style={categoriesStyle}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  style={categoryButtonStyle(selectedCategory === category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <Input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: '280px' }}
              rightIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              }
            />
          </div>
        </div>

        {isLoading ? (
          <Loading isFullScreen={false} text="Loading menu..." />
        ) : error ? (
          <EmptyState
            icon="error"
            title="Failed to load menu"
            description={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon="search"
            title="No dishes found"
            description="Try adjusting your filters or search query"
            actionLabel="Clear Filters"
            onAction={resetFilters}
          />
        ) : (
          <>
            <div style={gridStyle}>
              {products.map((product) => (
                <Card key={product._id} isHoverable>
                  <img
                    src={product.images?.[0]?.url || '/placeholder-food.jpg'}
                    alt={product.name}
                    style={productImageStyle}
                  />
                  <div style={productInfoStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={productNameStyle}>{product.name}</h3>
                      {product.isFeatured && (
                        <Badge size="sm" color="primary" isPill>
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p style={productDescriptionStyle}>{product.description}</p>
                    <div style={productFooterStyle}>
                      <span style={priceStyle}>${product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        leftIcon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={pageButtonStyle(false, !pagination.hasPrevPage)}
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={pageButtonStyle(pageNum === pagination.page, false)}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  style={pageButtonStyle(false, !pagination.hasNextPage)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
