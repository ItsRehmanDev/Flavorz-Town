import { useState, useCallback, useEffect } from 'react';
import { orderApi } from '../api';

/**
 * Hook for managing user orders
 * @param {Object} options - Hook options
 * @param {number} [options.page=1] - Initial page
 * @param {number} [options.limit=10] - Items per page
 * @returns {Object} Orders data and methods
 */
export function useOrders(options = {}) {
  const { page: initialPage = 1, limit = 10 } = options;

  const [orders, setOrders] = useState([]);
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
    status: '',
    sort: '-createdAt',
  });

  const fetchOrders = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...params,
      };

      // Remove empty filters
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await orderApi.getMyOrders(queryParams);
      const { orders: data, pagination: paginationData } = response.data.data;

      setOrders(data);
      setPagination({
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        totalPages: paginationData.totalPages,
        hasNextPage: paginationData.hasNextPage,
        hasPrevPage: paginationData.hasPrevPage,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const fetchOrderById = useCallback(async (id) => {
    try {
      const response = await orderApi.getById(id);
      return response.data.data.order;
    } catch (err) {
      console.error('Error fetching order:', err);
      throw err;
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderApi.create(orderData);
      return response.data.data.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id, reason) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderApi.cancel(id, reason);
      // Update the order in the list
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response.data.data.order : order))
      );
      return response.data.data.order;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
      console.error('Error canceling order:', err);
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: '',
      sort: '-createdAt',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Fetch orders when page or filters change
  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  return {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    setPage,
    updateFilters,
    resetFilters,
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    refetch: fetchOrders,
  };
}

/**
 * Hook for managing a single order
 * @param {string} id - Order ID
 */
export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await orderApi.getById(id);
        setOrder(response.data.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
        console.error('Error fetching order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, isLoading, error };
}
