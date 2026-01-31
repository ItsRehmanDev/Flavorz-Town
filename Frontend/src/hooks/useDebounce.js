import { useState, useEffect, useRef } from 'react';

/**
 * Hook for debouncing a value
 * @param {any} value - Value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for debouncing a function
 * @param {Function} callback - Function to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function useDebouncedCallback(callback, delay = 500) {
  const timeoutRef = useRef(null);

  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook for debouncing search input with loading state
 * @param {Object} options - Hook options
 * @param {number} [options.delay=500] - Debounce delay
 * @returns {Object} Search state and handlers
 */
export function useDebouncedSearch(options = {}) {
  const { delay = 500 } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, delay);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    setIsSearching,
    handleSearch,
    clearSearch,
  };
}
