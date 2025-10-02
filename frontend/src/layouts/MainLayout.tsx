import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-secondary">
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
