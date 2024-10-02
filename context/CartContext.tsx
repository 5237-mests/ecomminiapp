"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextProps {
  cartItems: { [key: number]: number };
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: (productId: number) => void; // New function to completely remove items
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  // Function to add an item to the cart
  const addItem = (productId: number) => {
    setCartItems((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  // Function to remove one quantity of an item
  const removeItem = (productId: number) => {
    setCartItems((prevCart) => ({
      ...prevCart,
      [productId]: Math.max((prevCart[productId] || 0) - 1, 0),
    }));
  };

  const clearCart = () => {
    setCartItems({});
  };

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
