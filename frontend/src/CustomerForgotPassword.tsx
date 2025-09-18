import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // for redirect
import bgImage from "../assests/SignUpbg.jpeg";

const CustomerForgotPassword = () => {
  const navigate = useNavigate(); // hook for navigation
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      setOtpEnabled(false);
      return;
    }

    const emailRegex = /^[a-z0-9@._-]+$/; // lowercase letters, numbers, . @ _ -
    if (!emailRegex.test(email)) {
      setError(
        "Email should contain lowercase letters, numbers or special characters (@ . _ -)"
      );
      setOtpEnabled(false);
      return;
    }

    setError("");
    setOtpEnabled(true); // enable OTP field
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChangeEmail = () => {
    setOtpEnabled(false);
    setOtp(Array(6).fill(""));
    setEmail("");
    setOtpError("");
  };

  const handleValidateOtp = () => {
    const otpValue = otp.join("");
    const correctOtp = "123456"; // example correct OTP
    if (otpValue.length < 6) {
      setOtpError("Please enter complete OTP");
      return;
    }
    if (otpValue === correctOtp) {
      setOtpError("");
      navigate("/create-password"); // redirect if OTP is correct
    } else {
      setOtpError("Invalid OTP. Please try again");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold text-white mb-8">
          Reset Password Form
        </h1>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 space-y-4">
          <h2 className="text-xl font-semibold text-center text-blue-600 mb-2">
            Forgot Password
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            {/* Email + Send button */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Your e-mail address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.replace(/[^a-z0-9@._-]/g, ""))
                }
                readOnly={otpEnabled} // freeze email after Send
                className={`flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                  otpEnabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <button
                type="submit"
                disabled={otpEnabled} // disable Send after OTP enabled
                className={`px-4 py-2 rounded text-white ${
                  otpEnabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition"
                }`}
              >
                Send
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* OTP fields */}
            <div className="flex justify-start space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={!otpEnabled}
                  className={`w-10 h-10 text-center text-lg border rounded focus:outline-none ${
                    otpEnabled
                      ? "border-black focus:ring-2 focus:ring-green-500"
                      : "bg-gray-100 cursor-not-allowed border-gray-200 text-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* OTP error message */}
            {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}

            {/* Change Email & Validate OTP */}
            {otpEnabled && (
              <div className="flex justify-between items-center mt-2">
                <p
                  onClick={handleChangeEmail}
                  className="text-blue-600 text-sm cursor-pointer hover:underline"
                >
                  Change Email
                </p>
                <p
                  onClick={handleValidateOtp}
                  className="text-blue-600 text-sm cursor-pointer hover:underline"
                >
                  Validate OTP
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForgotPassword;
