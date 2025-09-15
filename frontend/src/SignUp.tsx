import React, { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle password change
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    // Validate compulsory fields
    if (!name.trim()) {
      setNameError("❌ Name is required");
      valid = false;
    } else setNameError("");

    if (!email.trim()) {
      setEmailError("❌ Email is required");
      valid = false;
    } else setEmailError("");

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

    // All validations passed
    alert(
      `✅ SignUp Successful!\nGoogle Maps Link: ${
        googleMapLink || "Not Provided"
      }`
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-500 relative p-4 overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/25 backdrop-blur-md shadow-2xl hover:bg-white/30 transition">
        {/* User Icon */}
        <div className="flex justify-center mb-8">
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

        <h2 className="text-center text-2xl font-serif uppercase tracking-widest text-black mb-12">
          Customer SignUp
        </h2>

        {/* Name */}
        <div className="border-b border-black mb-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2"
          />
        </div>
        {nameError && <p className="text-red-600 text-sm mb-2">{nameError}</p>}

        {/* Email + Mobile side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border-b border-black">
            <input
              type="email"
              placeholder="Email ID"
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setMobile(value);
              }}
              maxLength={10}
              className="w-full bg-transparent outline-none text-black placeholder-black py-2"
            />
          </div>
        </div>
        {mobileError && <p className="text-red-600 text-sm mb-2">{mobileError}</p>}
        {emailError && <p className="text-red-600 text-sm mb-2">{emailError}</p>}

        {/* Password + Confirm Password side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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
              {showPassword ? (
                <span>👁️</span>
              ) : (
                <span>🙈</span>
              )}
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
              {showConfirmPassword ? (
                <span>👁️</span>
              ) : (
                <span>🙈</span>
              )}
            </button>
          </div>
        </div>
        {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}

        {/* Address */}
        <div className="border-b border-black mb-4">
          <textarea
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2 resize-none"
            rows={3}
          />
        </div>
        {addressError && <p className="text-red-600 text-sm mb-2">{addressError}</p>}

        {/* Optional Google Maps Link */}
        <div className="border-b border-black mb-6">
          <input
            type="url"
            placeholder="Google Maps Link (Optional)"
            value={googleMapLink}
            onChange={(e) => setGoogleMapLink(e.target.value)}
            className="w-full bg-transparent outline-none text-black placeholder-black py-2"
          />
        </div>

        {/* Submit Button */}
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
