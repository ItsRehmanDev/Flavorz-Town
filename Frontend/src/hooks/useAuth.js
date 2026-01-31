import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to protect admin routes
 * Redirects non-admin users to home page
 */
export function useAdminGuard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        setIsAuthorized(false);
        window.location.href = '/';
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, user, isLoading]);

  return { isAuthorized, isLoading };
}

/**
 * Hook to protect authenticated routes
 * Redirects unauthenticated users to login page
 */
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        window.location.href = '/login';
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthorized, isLoading };
}

/**
 * Hook to prevent authenticated users from accessing auth pages (login/register)
 * Redirects authenticated users to home page
 */
export function useGuestGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShouldRedirect(true);
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  return { shouldRedirect, isLoading };
}
