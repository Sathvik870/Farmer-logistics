import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/common/socket/useSocket.ts";
import api from "../../api";
import { HiVolumeUp, HiVolumeOff, HiEye } from "react-icons/hi";
import useSound from "use-sound";
import notificationSound from "../../assets/sounds/notification.mp3";
import { registerForPushNotifications } from "../../utils/pushManager";
import OrderItemsModal from "../../components/admin/OrderItemsModal";
import { useAlert } from "../../context/common/AlertContext";

interface Order {
  sales_order_id: number;
  invoice_code: string;
  customer_name: string;
  total_amount: number;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
  order_date: string;
  shipping_address: string;
  phone_number: string;
  order_items: [];
  isNew?: boolean;
}

const SalesOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const socket = useSocket();
  const { showAlert } = useAlert();
  const [selectedOrderItems, setSelectedOrderItems] = useState<{
    items: [];
    id: number;
  } | null>(null);
  const [play] = useSound(notificationSound);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/admin/sales-orders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleNotifications = async () => {
    if (!isSoundEnabled) {
      const success = await registerForPushNotifications();
      if (success) {
        setIsSoundEnabled(true);
      } else {
        console.error("Push notification registration failed");
      }
    } else {
      setIsSoundEnabled(false);
    }
  };

  const handlePaymentStatusChange = async (
    orderId: number,
    newStatus: string
  ) => {
    
    const performUpdate = async () => {
      try {
        await api.put(`/api/admin/sales-orders/${orderId}/payment-status`, {
          payment_status: newStatus,
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.sales_order_id === orderId ? { ...o, payment_status: newStatus } : o
          )
        );
      } catch (error: any) {
        showAlert(error.response?.data?.message || "Failed to update payment status.", "error");
      }
    };
    if (newStatus === 'Paid') {
      showAlert(
        "Are you sure you want to mark this order as Paid? This action cannot be easily undone.",
        "warning",
        performUpdate
      );
    } else {
      performUpdate();
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder: Order) => {
      setOrders((prevOrders) => {
        const cleanOrders = prevOrders.map((o) => ({ ...o, isNew: false }));
        return [{ ...newOrder, isNew: true }, ...cleanOrders];
      });

      if (isSoundEnabled) {
        play();

        if ("Notification" in window && Notification.permission === "granted") {
          try {
            const notification = new Notification("New Order Received!", {
              body: `Customer: ${newOrder.customer_name}\nAmount: ₹${newOrder.total_amount}`,
              icon: "/logo_png.png",
              requireInteraction: true,
              silent: true,
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          } catch (e) {
            console.error("Notification failed", e);
          }
        }
      }

      setTimeout(() => {
        setOrders((currentOrders) =>
          currentOrders.map((o) =>
            o.sales_order_id === newOrder.sales_order_id
              ? { ...o, isNew: false }
              : o
          )
        );
      }, 60000);
    };

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, [socket, isSoundEnabled, play]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const performUpdate = async () => {
      try {
        await api.put(`/api/admin/sales-orders/${orderId}/status`, {
          status: newStatus,
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.sales_order_id === orderId
              ? { ...o, delivery_status: newStatus }
              : o
          )
        );
      } catch (error: any) {
        showAlert(
          error.response?.data?.message || "Failed to update status.",
          "error"
        );
      }
    };

    if (newStatus === "Cancelled") {
      showAlert(
        "Are you sure you want to cancel this order? This will restore the items to stock.",
        "warning",
        performUpdate
      );
    } else {
      performUpdate();
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Orders</h1>
        <button
          onClick={toggleNotifications}
          className={`p-3 rounded-full ${
            isSoundEnabled ? "text-[#387c40]" : "text-red-600"
          } transition-colors`}
          title={isSoundEnabled ? "Mute Notifications" : "Enable Notifications"}
        >
          {isSoundEnabled ? (
            <HiVolumeUp size={24} />
          ) : (
            <HiVolumeOff size={24} />
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-[#387c40]">
            <tr>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Invoice
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-sm font-bold text-white uppercase">
                Order Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.sales_order_id}
                className={`transition-colors duration-500 ${
                  order.isNew
                    ? "bg-yellow-100 animate-pulse-subtle"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium">
                  {order.sales_order_id}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-black">
                  {order.invoice_code || "Pending"}
                </td>
                <td className="px-6 py-4">{order.customer_name}</td>
                <td className="px-6 py-4 font-mono text-sm">
                  {order.phone_number}
                </td>
                <td
                  className="px-6 py-4 text-sm text-black truncate max-w-xs"
                  title={order.shipping_address}
                >
                  {order.shipping_address || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      setSelectedOrderItems({
                        items: order.order_items,
                        id: order.sales_order_id,
                      })
                    }
                    className="flex items-center gap-1 text-sm font-bold text-[#387c40] hover:text-[#144a31] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                  >
                    <HiEye /> {order.order_items?.length || 0} Items
                  </button>
                </td>
                <td className="px-6 py-4 font-bold text-green-600">
                  ₹{Number(order.total_amount).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {order.payment_method === "COD" ? (
                    <div className="relative inline-block w-full max-w-[100px]">
                      <select
                        disabled={order.payment_status === 'Paid'}
                        value={order.payment_status}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.sales_order_id,
                            e.target.value
                          )
                        }
                        className={`
                          appearance-none w-full px-3 py-1.5 text-sm font-semibold border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all
                          disabled:cursor-not-allowed 
                          ${
                            order.payment_status === "Paid"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        `}
                      >
                        <option value="Unpaid">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.payment_status === "Paid"
                        ? "Paid (UPI)"
                        : order.payment_status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="relative inline-block w-full max-w-[140px]">
                    <select
                      value={order.delivery_status || "Confirmed"}
                      onChange={(e) =>
                        handleStatusChange(order.sales_order_id, e.target.value)
                      }
                      disabled={
                        order.delivery_status === "Cancelled" ||
                        order.delivery_status === "Delivered"
                      }
                      className={`
                          appearance-none w-full px-3 py-1.5 text-sm font-semibold border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all
                          ${
                            order.delivery_status === "Delivered"
                              ? "bg-green-50 border-green-200 text-green-700 focus:ring-green-500 disabled:cursor-not-allowed"
                              : order.delivery_status === "Cancelled"
                              ? "bg-red-50 border-red-200 text-red-700 focus:ring-red-500 disabled:cursor-not-allowed"
                              : order.delivery_status === "In Transit"
                              ? "bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500"
                              : "bg-yellow-50 border-yellow-200 text-yellow-700 focus:ring-yellow-500"
                          }
                        `}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packing">Packing</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderItemsModal
        isOpen={!!selectedOrderItems}
        onClose={() => setSelectedOrderItems(null)}
        items={selectedOrderItems?.items || []}
        orderId={selectedOrderItems?.id || 0}
      />
    </div>
  );
};

export default SalesOrdersPage;
