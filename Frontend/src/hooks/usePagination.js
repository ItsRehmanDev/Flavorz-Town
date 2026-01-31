import { useState, useCallback } from 'react';

/**
 * Hook for managing pagination state
 * @param {Object} options - Hook options
 * @param {number} [options.initialPage=1] - Initial page
 * @param {number} [options.initialLimit=10] - Items per page
 * @param {number} [options.totalItems=0] - Total number of items
 * @returns {Object} Pagination state and methods
 */
export function usePagination(options = {}) {
  const { initialPage = 1, initialLimit = 10, totalItems = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = Math.ceil(totalItems / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  const goToPage = useCallback((newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    setPage: goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setLimit: changeLimit,
    reset,
  };
}

/**
 * Hook for generating pagination range with ellipsis
 * @param {Object} options - Hook options
 * @param {number} options.currentPage - Current page
 * @param {number} options.totalPages - Total pages
 * @param {number} [options.siblingCount=1] - Number of siblings to show
 * @returns {Array} Array of page numbers and ellipsis
 */
export function usePaginationRange({ currentPage, totalPages, siblingCount = 1 }) {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const DOTS = '...';

  if (totalPages <= siblingCount * 2 + 5) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = siblingCount * 2 + 3;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = siblingCount * 2 + 3;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [1, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, DOTS, ...middleRange, DOTS, totalPages];
  }

  return range(1, totalPages);
}
