import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedPassword = password;
    const trimmedConfirm = confirmPassword;

    if (!trimmedUsername || !trimmedEmail || !trimmedPhone || !trimmedPassword || !trimmedConfirm) {
      return 'Please provide all required fields.';
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }

    const phoneRe = /^\d{10}$/;
    if (!phoneRe.test(trimmedPhone)) {
      return 'Phone number must be numeric and exactly 10 digits.';
    }

    if (trimmedPassword.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (trimmedPassword !== trimmedConfirm) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const clientValidationError = validateInputs();
    if (clientValidationError) {
      setError(clientValidationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/signup', {
        username: username.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password
      });

      navigate('/login', {
        state: { message: 'Account created successfully! Please log in.' }
      });
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An unexpected error occurred.');
      } else {
        setError('Failed to connect to the server.');
      }
      console.error('Signup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              pattern="\d*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10 digit phone number (numbers only).</p>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;