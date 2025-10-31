import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/customer/Navbar";
import FloatingCartButton from "../../components/customer/FloatingCartButton";

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <FloatingCartButton />
    </div>
  );
};

export default CustomerLayout;