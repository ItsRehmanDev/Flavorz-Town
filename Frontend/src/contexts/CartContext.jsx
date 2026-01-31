import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'flavorz_cart';

const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  isOpen: false,
};

function calculateTotals(items) {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      subtotal: acc.subtotal + item.price * item.quantity,
    }),
    { totalItems: 0, subtotal: 0 }
  );
}

function cartReducer(state, action) {
  let newItems;
  
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        ...calculateTotals(action.payload),
      };
      
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
        isOpen: true,
      };
    }
    
    case 'REMOVE_ITEM':
      newItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
      
    case 'UPDATE_QUANTITY':
      newItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
      
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
      
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
      
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
      
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
      
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1, options = []) => {
    const cartItem = {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.image,
      quantity,
      options,
    };
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
