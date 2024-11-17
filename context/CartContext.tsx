'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UseCartReturnType } from '@/types/types';
import { fetchcart, handleCartQuantity } from '@/controller/CartController';

const CartContext = createContext<UseCartReturnType | undefined>(undefined);
const userId = 'cm2w8sjta00009lg4w2152lwo';
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({
    0: false,
  });
  console.log('cartItems', cartItems);
  //////////////////
  const [isCartOpen, setIsCartOpen] = useState<{ [key: number]: boolean }>({
    0: false,
  });
  const [cartIteemsProducts, setCartItemsProducts] = useState(
    [] as UseCartReturnType['cartIteemsProducts'],
  );
  useEffect(() => {
    fetchcart().then((data) => {
      setCartItemsProducts(data);
    });
  }, [isCartOpen]);
  const filteredQuantity = (productId: number): number => {
    if (cartIteemsProducts) {
      const product = cartIteemsProducts.find(
        (item: { product_id: number }) => item.product_id === productId,
      );
      return product ? product.quantity : 0;
    }
    return 0;
  };
  const itemQuantity = (productId: number): number => {
    if (productId === 0) return 0;
    return filteredQuantity(productId);
  };

  const fetchCartItems = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userId: userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cartItems) {
          const product = data.cartItems.find(
            (item: { product_id: number }) => item.product_id === productId,
          );
          if (product?.quantity > 0) {
            setCartItems({
              [productId]: (product?.quantity || null) as number,
            });
          } else {
            setCartItems({
              [productId]: 0,
            });
          }
          setLoading({ [productId]: false });
        }
        return 0;
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addItem = async (productId: number) => {
    const requestBody = {
      userId,
      productId,
      quantity: 1,
    };
    setLoading({ [productId]: true });
    await handleCartQuantity(requestBody); // Update cart on server
    setIsCartOpen({ [productId]: true });
    await fetchCartItems(productId); // Refresh cart items in state
  };

  const removeItem = async (productId: number) => {
    const requestBody = {
      userId,
      productId,
      quantity: -1, // Reducing quantity by 1
    };
    setLoading({ [productId]: true });

    await handleCartQuantity(requestBody); // Update cart on server
    setIsCartOpen({ [productId]: true });
    await fetchCartItems(productId); // Refresh cart items in state
  };

  const clearCart = () => {
    setCartItems({});
  };
  console.log(loading);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        clearCart,
        loading,
        itemQuantity,
        isCartOpen,
        cartIteemsProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
