import React, { useState, useRef, useEffect } from "react";
import type { ProductWithImage } from "../../pages/admin/ProductsPage";
import { useCart } from "../../context/customer/cart/useCart.ts";
import { HiPlus, HiMinus } from "react-icons/hi";

interface ProductCardProps {
  product: ProductWithImage;
}

interface QuantityStepperProps {
  productId: number;
  onEditingChange: (isEditing: boolean) => void;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  productId,
  onEditingChange,
}) => {
  const { getItemQuantity, updateItemQuantity, updateItemQuantityLive } =
    useCart();
  const quantity = getItemQuantity(productId);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onEditingChange(isEditing);
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, onEditingChange]);

  const handleFinalUpdate = () => {
    setIsEditing(false);
    let finalQuantity = Math.floor(quantity);
    if (finalQuantity < 0) finalQuantity = 0;
    updateItemQuantity(productId, finalQuantity);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFinalUpdate();
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#387c40] text-white font-bold rounded-lg w-24 h-9">
      <button
        onClick={() => updateItemQuantity(productId, quantity - 1)}
        className="px-3 py-1 h-full flex-shrink-0 flex items-center justify-center rounded-l-lg transition-colors"
      >
        <HiMinus size={16} />
      </button>
      <div className="flex-grow w-8 flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={quantity === 0 && isEditing ? "" : String(quantity)}
            onChange={(e) => updateItemQuantityLive(productId, e.target.value)}
            onBlur={handleFinalUpdate}
            onKeyDown={handleKeyDown}
            className="w-full text-center bg-transparent outline-none appearance-none [-moz-appearance:textfield]"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="cursor-pointer w-full h-full flex items-center justify-center"
          >
            {Math.floor(quantity)}
          </span>
        )}
      </div>

      <button
        onClick={() => updateItemQuantity(productId, quantity + 1)}
        className="px-3 py-1 h-full flex-shrink-0 flex items-center justify-center rounded-r-lg transition-colors"
      >
        <HiPlus size={16} />
      </button>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.product_id);

  const [isStepperEditing, setIsStepperEditing] = useState(false);
  const showAddButton = quantity === 0 && !isStepperEditing;
  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col justify-between hover:shadow-lg transition-shadow h-75">
      <div>
        <div className="relative w-full h-36 mb-3 overflow-hidden rounded-md">
          <img
            src={product.imageUrl || "https://via.placeholder.com/200"}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 h-10">
          {product.product_name}
        </h3>
        <p className="text-medium text-gray-500">
          {product.sell_per_unit_qty} {product.selling_unit}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-gray-900">
          ₹{product.selling_price}
        </span>
        {showAddButton ? (
          <button
            onClick={() => addToCart(product)}
            className="border-2 border-[#387c40] text-green-700 font-bold px-6 py-1.5 rounded-lg hover:bg-[#387c40] hover:text-white transition-all duration-300"
          >
            ADD
          </button>
        ) : (
          <QuantityStepper
            productId={product.product_id}
            onEditingChange={setIsStepperEditing}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
