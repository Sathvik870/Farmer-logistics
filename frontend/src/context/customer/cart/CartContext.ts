import { createContext } from "react";
import type { ProductWithImage } from "../../../pages/admin/ProductsPage";

export interface CartItem extends ProductWithImage {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductWithImage) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  getItemQuantity: (productId: number) => number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);