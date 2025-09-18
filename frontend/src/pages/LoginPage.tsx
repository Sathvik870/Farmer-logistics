import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyIcon from '../assets/UserIcon.jpg'
import BgPic from'../assets/login-background.jpg'
import { FaLock,FaUser } from "react-icons/fa";
import api from '../api';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate(); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { username, password });
      login(response.data); 
      navigate('/home');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An unexpected error occurred.');
      } else {
        setError('Failed to connect to the server.');
      }
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end min-h-screen bg-gray-100 text-gray-900">
      <img src={BgPic} alt="" className=' w-200 min-h-screen'/>
      <div className="w-full max-w-lg p-8 space-y-6 bg-green-300 rounded-lg shadow-lg min-h-screen flex flex-col  items-center justify-center">
        <img src={MyIcon} alt="" className='h-20 rounded-full'/>
        <h2 className="text-3xl font-bold text-center">
          Partner login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label 
              htmlFor="username" 
              className="block mb-0 text-sm font-medium text-gray-700 "
            >
              Username
            </label>
            <div>
              <FaUser className='absolute top-78.5 translate-y-2 left-223 '/>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-l px-5 py-2  border-b border-black  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block mb-0 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <FaLock className='absolute top-100 translate-y-2 left-223 '/>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-5 py-2 border-b border-black  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-4xl shadow-sm hover:shadow-black bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;