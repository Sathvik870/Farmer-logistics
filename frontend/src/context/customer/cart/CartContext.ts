import { createContext } from "react";
import type { ProductWithImage } from "../../../pages/admin/ProductsPage";

export interface CartItem extends ProductWithImage {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;  
  totalPrice: number;
  addToCart: (product: ProductWithImage) => void;
  getItemQuantity: (productId: number) => number;
  incrementItem: (productId: number) => void;
  decrementItem: (productId: number) => void;
  setItemQuantity: (productId: number, quantity: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);