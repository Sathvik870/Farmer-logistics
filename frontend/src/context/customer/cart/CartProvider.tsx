import { useState, useEffect, type ReactNode } from "react";
import { useProducts } from "../product/useProducts";
import { CartContext, type CartItem ,type CartValidationMessages } from "./CartContext.ts";
import type { ProductWithImage } from "../../../pages/admin/ProductsPage.tsx";
const CART_STORAGE_KEY = 'farmerLogisticsCart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  const { products, fetchProducts } = useProducts();
  const [validationMessages, setValidationMessages] = useState<CartValidationMessages>({});

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const validateCart = async () => {
    await fetchProducts();
    const newMessages: CartValidationMessages = {};
    const updatedCartItems = cartItems.map(cartItem => {
      const liveProduct = products.find(p => p.product_id === cartItem.product_id);
      let updatedQuantity = cartItem.quantity;
      
      if (!liveProduct || liveProduct.saleable_quantity <= 0) {
        newMessages[cartItem.product_id] = "Out of Stock";
        updatedQuantity = 0;
      } else if (cartItem.quantity > liveProduct.saleable_quantity) {
        newMessages[cartItem.product_id] = `Only ${liveProduct.saleable_quantity} available`;
      }

      return { ...cartItem, quantity: updatedQuantity };
    });

    setValidationMessages(newMessages);
    setCartItems(updatedCartItems.filter(item => item.quantity > 0));
  };

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

  const clearCart = () => {
    setCartItems([]);
    setValidationMessages({});
    localStorage.removeItem(CART_STORAGE_KEY); 
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
        clearCart,
        validationMessages,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
