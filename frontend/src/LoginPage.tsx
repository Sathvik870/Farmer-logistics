// src/LoginPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 import Link
import bgImage from "../assests/LoginPage.jpg"; // 👈 make sure your path is correct (assets not assests)

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }} // 👈 background applied
    >
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 w-[380px] shadow-2xl hover:bg-black/40">
        {/* User Icon */}
        <div className="flex justify-center mb-3">
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
        <h2 className="text-white text-center text-2xl font-bold mb-5 font-serif uppercase text-1xl">
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
              required
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-white flex items-center"
            >
              {showPassword ? (
                // Eye Off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.5 10.5a3 3 0 014 4m1.5 1.5c-1.5 1.5-4.5 4.5-7.5 4.5S3 18 3 12s4.5-9 9-9c3 0 6 3 6 3"
                  />
                </svg>
              ) : (
                // Eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5c7.5 0 9 7 9 7s-1.5 7-9 7-9-7-9-7 1.5-7 9-7zM12 12a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
              )}
            </button>
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
            <a
              href="#forgot-password"
              className=" text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 bg-[#9b5de5] hover:bg-orange-500 text-white font-semibold rounded-lg transition"
          >
            LOGIN
          </button>

          {/* Signup Link */}
          <p className="text-center text-white text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
