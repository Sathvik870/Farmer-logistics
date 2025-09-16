// src/pages/SignUpPage.tsx

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const LockIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const EyeOpenIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeClosedIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);
const EmailIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);
const PhoneIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z"
    />
  </svg>
);

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        phoneNumber,
        password,
      });
      alert("Signup successful! You can now log in.");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Signup failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-login-bg bg-cover bg-center">
      <div className="min-h-screen flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm text-white">
          <h1 className="text-3xl font-bold text-center mb-8 drop-shadow-lg">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/30 text-lg pl-12 pr-4 py-2 focus:outline-none focus:border-green-400 transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <EmailIcon />
              </span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/30 text-lg pl-12 pr-4 py-2 focus:outline-none focus:border-green-400 transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <PhoneIcon />
              </span>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/30 text-lg pl-12 pr-4 py-2 focus:outline-none focus:border-green-400 transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/30 text-lg pl-12 pr-12 py-2 focus:outline-none focus:border-green-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white transition"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <LockIcon />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/30 text-lg pl-12 pr-12 py-2 focus:outline-none focus:border-green-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 px-4 py-3 font-bold text-white rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 ease-in-out hover:bg-white/30 hover:border-white/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:bg-gray-400/50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="mt-2 text-center">
            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-white hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center min-h-[20px]">
            {error && (
              <p className="text-sm text-red-400 font-semibold">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
