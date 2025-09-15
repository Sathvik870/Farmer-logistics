// src/LoginPage.tsx
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#9b5de5] via-[#f15bb5] to-[#ff6f61]">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 w-[380px] shadow-2xl">
        {/* User Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/30 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-center text-2xl font-bold mb-6">
          Customer Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="flex items-center bg-white/20 rounded-lg px-3 py-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-white/20 rounded-lg px-3 py-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-white mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12V8a4 4 0 00-8 0v4M5 12h14v8H5v-8z"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
              required
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm text-white mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#9b5de5]"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 bg-[#9b5de5] hover:bg-[#7a3dc2] text-white font-semibold rounded-lg transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 