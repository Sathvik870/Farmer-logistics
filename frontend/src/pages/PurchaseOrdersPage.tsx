import React, { useState, useEffect } from "react";
import api from "../api";
import { useAlert } from "../context/AlertContext";
import { HiPlus, HiChevronDown, HiChevronUp } from "react-icons/hi";
import AddPurchaseOrderModal from "../components/AddPurchaseOrderModal";

interface PurchaseOrder {
  purchase_id: number;
  purchase_date: string;
  supplier_name: string;
  supplier_contact: string;
  total_amount: string; 
}

interface PurchaseOrderItem {
  item_id: number;
  product_id: number;
  quantity: number;
  purchase_price: number;
  product_code: string;
  product_name: string;
  category: string;
  unit: string;
}

const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get<PurchaseOrder[]>("/api/purchases");
      setOrders(response.data);
    } catch (error) {
      showAlert("Failed to load purchase orders.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Orders</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex gap-3 text-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#144a31] to-[#387c40] px-7 py-3 rounded-full border border-[#144a31] hover:scale-105 duration-200 justify-center items-center"
        >
          <HiPlus size={20} /> Add Purchase Order
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-xl text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            No purchase orders found.
          </p>
        ) : (
          orders.map((order) => (
            <PurchaseOrderAccordion
              key={order.purchase_id}
              order={order}
              isExpanded={expandedId === order.purchase_id}
              toggleExpand={() => toggleAccordion(order.purchase_id)}
            />
          ))
        )}
      </div>

      <AddPurchaseOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveSuccess={fetchOrders}
      />
    </div>
  );
};

const PurchaseOrderAccordion: React.FC<{
  order: PurchaseOrder;
  isExpanded: boolean;
  toggleExpand: () => void;
}> = ({ order, isExpanded, toggleExpand }) => {
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const { showAlert } = useAlert();

  const fetchItems = async () => {
    if (isExpanded && items.length === 0) {
      setLoadingItems(true);
      try {
        const response = await api.get<PurchaseOrderItem[]>(
          `/api/purchases/${order.purchase_id}/items`
        );
        setItems(response.data);
      } catch (error) {
        showAlert("Failed to load order items.", "error");
        console.error(error);
      } finally {
        setLoadingItems(false);
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isExpanded]);

  const formattedDate = new Date(order.purchase_date).toLocaleDateString();

  return (
    <div className="bg-[#f7f7f7] rounded-xl shadow-md overflow-hidden">

      <div
        className="flex items-center justify-between p-6 cursor-pointer border-b hover:bg-[#387c4010] transition-all"
        onClick={toggleExpand}
      >
        <div className="font-semibold text-lg text-gray-800 w-1/4">
          PO-{String(order.purchase_id).padStart(4, "0")}
        </div>
        <div className="text-base text-gray-600 w-1/4">
          Supplier: {order.supplier_name}
        </div>
        <div className="text-base text-gray-600 w-1/4">
          Date: {formattedDate}
        </div>
        <div className="text-xl font-bold text-[#144a31] w-1/4 text-right flex justify-end items-center gap-4">
          Total: ${Number(order.total_amount).toFixed(2)}
          {isExpanded ? <HiChevronUp size={24} /> : <HiChevronDown size={24} />}
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="p-6 bg-white/70">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-700">
            Order Items
          </h3>
          {loadingItems ? (
            <p>Loading items...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Rate
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.item_id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.product_code}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      ${Number(item.purchase_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-[#144a31]">
                      $
                      {(item.quantity * Number(item.purchase_price)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
