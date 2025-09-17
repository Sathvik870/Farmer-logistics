import React from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.username}!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your role is: <span className="font-semibold capitalize text-blue-600">{user?.role}</span>
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;