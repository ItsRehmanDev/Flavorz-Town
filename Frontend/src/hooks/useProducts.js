import { useState, useCallback, useEffect } from 'react';
import { productApi } from '../api';

/**
 * Hook for managing products data
 * @param {Object} options - Hook options
 * @param {number} [options.page=1] - Initial page
 * @param {number} [options.limit=12] - Items per page
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Object} Products data and methods
 */
export function useProducts(options = {}) {
  const { page: initialPage = 1, limit = 12, sort = '-createdAt' } = options;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    sort,
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    isActive: true,
  });

  const fetchProducts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
        ...filters,
        ...params,
      };

      // Remove empty filters
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await productApi.getAll(queryParams);
      const { products: data, pagination: paginationData } = response.data.data;

      setProducts(data);
      setPagination({
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        totalPages: paginationData.totalPages,
        hasNextPage: paginationData.hasNextPage,
        hasPrevPage: paginationData.hasPrevPage,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const fetchProductById = useCallback(async (id) => {
    try {
      const response = await productApi.getById(id);
      return response.data.data.product;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  }, []);

  const searchProducts = useCallback(async (query, params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productApi.search(query, {
        page: 1,
        limit: 12,
        ...params,
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      sort: '-createdAt',
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      isActive: true,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  return {
    products,
    isLoading,
    error,
    pagination,
    filters,
    setPage,
    updateFilters,
    resetFilters,
    fetchProducts,
    fetchProductById,
    searchProducts,
    refetch: fetchProducts,
  };
}

/**
 * Hook for managing a single product
 * @param {string} id - Product ID
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await productApi.getById(id);
        setProduct(response.data.data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
}
