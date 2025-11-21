import React from "react";
import { HiX } from "react-icons/hi";

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_type: string;
  selling_unit?: string;
  price: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: number;
}

const OrderItemsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  items,
  orderId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff3c] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-300 bg-[#387c40]">
          <h3 className="text-lg font-bold text-white">
            Items for Order : {orderId}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <HiX size={24} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-900 font-medium border-b-2 border-gray-300">
              <tr>
                <th className="pb-2">Product</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-gray-800">
                    {item.product_name}
                  </td>
                  <td className="py-3 text-center text-gray-600">
                    {item.quantity} {item.selling_unit || item.unit_type}
                  </td>
                  <td className="py-3 text-right font-mono text-gray-700">
                    ₹{item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t-2 border-gray-300 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsModal;
