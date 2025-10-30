import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/customer/Navbar";

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;