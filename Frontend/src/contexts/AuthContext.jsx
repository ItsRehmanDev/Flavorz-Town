import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authApi } from '../api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getMe();
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'AUTH_INIT' });
    try {
      const response = await authApi.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'AUTH_INIT' });
    try {
      const response = await authApi.register(userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await authApi.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.data.user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
