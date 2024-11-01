'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Interface defining the shape of the context
interface FavoritesContextProps {
  favoriteItems: { [key: number]: boolean }; // Object to track favorite items
  addFavorite: (productId: number) => void; // Function to add an item to favorites
  removeFavorite: (productId: number) => void; // Function to remove an item from favorites
  isFavorite: (productId: number) => boolean; // Function to check if an item is favorited
  clearFavorites: () => void; // Function to clear all favorites
}

// Create the FavoritesContext with default undefined to handle errors
const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined,
);

// Custom hook to use the context
export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Provider component to wrap around parts of the app where favorites will be accessible
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the favorite items, where the key is the product ID and value is true/false
  const [favoriteItems, setFavoriteItems] = useState<{
    [key: number]: boolean;
  }>({});

  // Function to add a product to favorites
  const addFavorite = (productId: number) => {
    setFavoriteItems((prevFavorites) => ({
      ...prevFavorites,
      [productId]: true, // Mark the item as a favorite
    }));
  };

  // Function to remove a product from favorites
  const removeFavorite = (productId: number) => {
    setFavoriteItems((prevFavorites) => {
      const updatedFavorites = { ...prevFavorites };
      delete updatedFavorites[productId]; // Remove the item from favorites
      return updatedFavorites;
    });
  };

  // Function to clear all favorites
  const clearFavorites = () => {
    setFavoriteItems({});
  };

  // Function to check if a product is in the favorites list
  const isFavorite = (productId: number) => !!favoriteItems[productId];

  return (
    <FavoritesContext.Provider
      value={{
        favoriteItems,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
