import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import Api from "../../Api/Api";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======= Forgot Password State =======
  const [showResetOtp, setShowResetOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);
  const [newPassword, setNewPassword] = useState("");

  // ================= HANDLE LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(phone, password);
      if (res.success) {
        navigate("/"); // or dashboard
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async () => {
    if (!phone) return setError("Enter your phone number");

    setLoading(true);
    setError("");
    try {
      await Api.post("/api/forgotPassword/send-otp", { phone });
      setShowResetOtp(true); // open OTP popup
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP INPUT HANDLERS =================
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // ================= VERIFY OTP & RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!newPassword) return setError("Enter a new password");
    setLoading(true);
    setError("");
    try {
      await Api.post("/api/forgotPassword/verify-otp", {
        phone,
        otp: otp.join(""),
        newPassword,
      });
      setShowResetOtp(false);
      alert("Password reset successful. Please login with new password.");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen relative">
    {/* ===== Background Image ===== */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    />

    {/* ===== Dark Overlay ===== */}
    <div className="absolute inset-0 bg-black/60" />

    {/* ===== Login Form ===== */}
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#141414]/90 backdrop-blur-lg border border-[#2a2a2a] rounded-xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 transition text-white py-2 rounded font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={handleForgotPassword}
          className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer text-center mt-3"
        >
          Forgot Password?
        </p>

        <p className="text-sm text-gray-400 text-center mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>

    {/* ===== OTP RESET MODAL ===== */}
    {showResetOtp && (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center px-4">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold text-white text-center mb-2">
            Reset Password
          </h3>
          <p className="text-sm text-gray-400 text-center mb-4">
            OTP sent to +91 {phone}
          </p>

          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
                className="w-10 h-10 text-center rounded bg-[#1f1f1f] text-white border border-[#333] focus:border-green-500 outline-none"
              />
            ))}
          </div>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-green-500"
          />

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Reset Password"}
          </button>

          <button
            onClick={() => setShowResetOtp(false)}
            className="w-full mt-3 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default Login;
