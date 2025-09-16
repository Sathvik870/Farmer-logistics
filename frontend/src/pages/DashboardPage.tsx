import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-xl mb-8">
        Welcome, <span className="font-bold">{user?.username || "User"}</span>!
      </p>

      {user?.role === "superadmin" && (
        <Link
          to="/approve-users"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Approve Users
        </Link>
      )}
    </div>
  );
};

export default DashboardPage;
