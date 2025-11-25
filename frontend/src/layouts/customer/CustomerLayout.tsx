import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/customer/Navbar";
import FloatingCartButton from "../../components/customer/FloatingCartButton";
import CartDrawer from "../../components/customer/CartDrawer";
import GuestLoginModal from "../../components/customer/GuestLoginModal";
import { useCustomerAuth } from "../../context/customer/auth/useCustomerAuth";
import { useSocket } from "../../context/common/socket/useSocket";

const CustomerLayout: React.FC = () => {
  const { isAuthenticated, customer } = useCustomerAuth();
  const socket = useSocket();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const routeLocation = useLocation();
  const pagesWithoutCategoryBar = ["/profile", "/orders", "/cart"];
  const isShoppingPage = !pagesWithoutCategoryBar.some((path) =>
    routeLocation.pathname.startsWith(path)
  );
  const handleCartClick = () => {
    if (isAuthenticated) {
      setIsCartOpen(true);
    } else {
      setIsGuestModalOpen(true);
    }
  };
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (!socket || !isAuthenticated || !customer) return;

    const handleStatusUpdate = (data: any) => {
      if (data.customerId === customer.customer_id) {
        if (Notification.permission === "granted") {
          new Notification(`Order number ${data.orderId} Updated`, {
            body: `Your order is now ${data.status}!`,
            icon: "/logo_png.png",
          });
        } else {
          alert(
            `Update: Your order number${data.orderId} is now ${data.status}`
          );
        }
      }
    };

    socket.on("order_status_updated", handleStatusUpdate);

    return () => {
      socket.off("order_status_updated", handleStatusUpdate);
    };
  }, [socket, isAuthenticated, customer]);

  const closeCart = () => setIsCartOpen(false);
  const closeGuestModal = () => setIsGuestModalOpen(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartClick={handleCartClick} />
      <main
        className={`container mx-auto px-4 py-8 ${
          isShoppingPage ? "pt-4" : "pt-8"
        }`}
      >
        <Outlet />
      </main>
      <FloatingCartButton onCartClick={handleCartClick} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <GuestLoginModal isOpen={isGuestModalOpen} onClose={closeGuestModal} />
    </div>
  );
};

export default CustomerLayout;
