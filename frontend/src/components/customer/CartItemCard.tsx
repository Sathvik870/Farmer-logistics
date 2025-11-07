import React from 'react';
import { type CartItem } from '../../context/customer/cart/CartContext.ts';
import { useCart } from '../../context/customer/cart/useCart.ts';
import CartQuantityStepper from './CartQuantityStepper';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { validationMessages } = useCart();
  const message = validationMessages[item.product_id];

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <img src={item.imageUrl || ''} alt={item.product_name} className="w-12 h-12 object-cover rounded-md" />
        <div>
          <p className="font-semibold text-sm text-gray-800">{item.product_name}</p>
          <p className="text-xs text-gray-500">{item.sell_per_unit_qty} {item.selling_unit}</p>
          {message && (
            <p className="text-xs font-semibold text-red-600 mt-1">{message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <CartQuantityStepper item={item} />
        <p className="font-semibold text-sm w-16 text-right">₹{(item.selling_price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItemCard;