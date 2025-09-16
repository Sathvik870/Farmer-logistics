import React, { useState } from "react";
import bgImage from "../assests/SignUpbg.jpeg";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");

  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Only allow letters and spaces in Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, ""); 
    setName(value.trimStart()); 
    if (!value.trim()) {
      setNameError("❌ Name is required");
    } else {
      setNameError("");
    }
  };

  // ✅ Mobile: allow only numbers and show error until 10 digits
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); 
    setMobile(value);

    if (value.length < 10) {
      setMobileError("❌ Enter a valid 10-digit number");
    } else {
      setMobileError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("❌ Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (password && value && password !== value) {
      setPasswordError("❌ Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError("❌ Name is required");
      valid = false;
    } else setNameError("");

    if (!mobile || mobile.length !== 10) {
      setMobileError("❌ Enter a valid 10-digit number");
      valid = false;
    } else setMobileError("");

    if (!password) {
      setPasswordError("❌ Password is required");
      valid = false;
    }

    if (!confirmPassword) {
      setPasswordError("❌ Confirm Password is required");
      valid = false;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("❌ Passwords do not match");
      valid = false;
    }

    if (!address.trim()) {
      setAddressError("❌ Address is required");
      valid = false;
    } else setAddressError("");

    if (!valid) return;

    alert(
      `✅ SignUp Successful!\nGoogle Maps Link: ${
        googleMapLink || "Not Provided"
      }`
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 rounded-xl bg-white/65 shadow-2xl max-h-[700px] hover:bg-white/70 transition-smooth">
        
        {/* User Icon */}
        <div className="flex justify-center mb-3">
          <div className="bg-green-600 p-5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl font-serif uppercase tracking-widest text-black mb-3">
          Customer SignUp
        </h2>

        {/* Name */}
        <div className="border-b border-black mb-2">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2"
          />
        </div>
        {nameError && <p className="text-red-600 text-sm mb-2">{nameError}</p>}

        {/* Email + Mobile */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="border-b border-black">
            <input
              type="email"
              placeholder="Email ID (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-black placeholder-black py-2"
            />
          </div>
          <div className="border-b border-black">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={handleMobileChange}
              maxLength={10}
              className="w-full bg-transparent outline-none text-black placeholder-black py-2"
            />
          </div>
        </div>
        {mobileError && <p className="text-red-600 text-sm mb-2">{mobileError}</p>}

        {/* Password + Confirm Password */}
        <div className="grid grid-cols-2 gap-4 mb-1">
          <div className="relative border-b border-black">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full bg-transparent outline-none text-black placeholder-black py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2/4 -translate-y-2/4 text-black"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <div className="relative border-b border-black">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full bg-transparent outline-none text-black placeholder-black py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2/4 -translate-y-2/4 text-black"
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}

        {/* Address */}
        <div className="border-b border-black mb-2">
          <textarea
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2 resize-none"
            rows={3}
          />
        </div>
        {addressError && <p className="text-red-600 text-sm mb-2">{addressError}</p>}

        {/* Google Maps Link */}
        <div className="border-b border-black mb-5">
          <input
            type="url"
            placeholder="Google Maps Link (Optional)"
            value={googleMapLink}
            onChange={(e) => setGoogleMapLink(e.target.value)}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transition uppercase"
        >
          SignUp
        </button>
      </div>
    </div>
  );
};

export default SignUp;
