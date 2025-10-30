import { useState, type ReactNode } from "react";

import { CartContext, type CartItem } from "./CartContext.ts";
import type { ProductWithImage } from "../../../pages/admin/ProductsPage.tsx";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: ProductWithImage) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product.product_id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateItemQuantity = (productId: number, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.product_id !== productId);
      }
      return prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
    });
  };

  const getItemQuantity = (productId: number): number => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateItemQuantity,
        getItemQuantity,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
