import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/customer/cart/useCart';
import { HiPlus, HiMinus } from 'react-icons/hi';

interface CartQuantityStepperProps {
  productId: number;
}

const CartQuantityStepper: React.FC<CartQuantityStepperProps> = ({ productId }) => {
  const { getItemQuantity, updateItemQuantity, updateItemQuantityLive } = useCart();
  const quantity = getItemQuantity(productId);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleFinalUpdate = () => {
    setIsEditing(false);
    let finalQuantity = Math.floor(quantity);
    if (finalQuantity < 0) finalQuantity = 0;
    updateItemQuantity(productId, finalQuantity);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFinalUpdate();
    }
  };

  return (
    <div className="flex items-center justify-between bg-green-100 text-green-700 font-bold rounded-lg w-20 h-8">
      <button 
        onClick={() => updateItemQuantity(productId, quantity - 1)} 
        className="px-2 h-full rounded-l-lg hover:bg-green-200"
      >
        <HiMinus size={12} />
      </button>

      <div className="flex-grow w-6 flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={quantity === 0 && isEditing ? "" : String(quantity)}
            onChange={(e) => updateItemQuantityLive(productId, e.target.value)}
            onBlur={handleFinalUpdate}
            onKeyDown={handleKeyDown}
            className="w-full text-center text-sm bg-transparent outline-none appearance-none [-moz-appearance:textfield]"
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)} 
            className="cursor-pointer w-full h-full flex items-center justify-center text-sm"
          >
            {Math.floor(quantity)}
          </span>
        )}
      </div>

      <button 
        onClick={() => updateItemQuantity(productId, quantity + 1)} 
        className="px-2 h-full rounded-r-lg hover:bg-green-200"
      >
        <HiPlus size={12} />
      </button>
    </div>
  );
};

export default CartQuantityStepper;