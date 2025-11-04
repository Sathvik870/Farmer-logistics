import { useState, type ReactNode } from "react";

import { CartContext, type CartItem } from "./CartContext.ts";
import type { ProductWithImage } from "../../../pages/admin/ProductsPage.tsx";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: ProductWithImage) => {
    if (product.saleable_quantity < 1) return;
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

  const incrementItem = (productId: number) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item.product_id === productId) {
          if (item.quantity < item.saleable_quantity) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      })
    );
  };

  const decrementItem = (productId: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product_id === productId);
      if (existingItem && existingItem.quantity === 1) {
        return prevItems.filter((item) => item.product_id !== productId);
      }
      return prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const setItemQuantity = (productId: number, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product_id === productId);
      if (!existingItem) return prevItems;

      let newQuantity = quantity;
      if (newQuantity < 0) newQuantity = 0;
      if (newQuantity > existingItem.saleable_quantity) {
        newQuantity = existingItem.saleable_quantity;
      }
      
      if (newQuantity === 0) {
        return prevItems.filter(item => item.product_id !== productId);
      }

      return prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const getItemQuantity = (productId: number): number => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.filter((item) => item.quantity > 0).length;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.selling_price * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementItem,
        decrementItem,
        setItemQuantity,
        getItemQuantity,
        cartCount,
        totalPrice,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};
