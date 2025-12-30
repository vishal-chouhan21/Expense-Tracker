import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Api/Api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);

  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLE FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= OTP INPUT ================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  /* ================= SEND OTP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await Api.post("/api/otp/send-otp", {
        phone: formData.phone,
      });

      setShowOtp(true); // 🔥 open popup
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await Api.post("/api/otp/verify-otp", {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        otp: otp.join(""),
      });

      navigate("/login");
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

    {/* ================= SIGNUP FORM ================= */}
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#141414]/90 backdrop-blur-lg border border-[#2a2a2a] rounded-xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded bg-[#1f1f1f] text-white border border-[#333] focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 transition text-white py-2 rounded font-medium"
        >
          {loading ? "Sending OTP..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>

    {/* ================= OTP POPUP ================= */}
    {showOtp && (
      <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center px-4">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold text-white text-center mb-2">
            Verify OTP
          </h3>
          <p className="text-sm text-gray-400 text-center mb-4">
            Sent to +91 {formData.phone}
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

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => setShowOtp(false)}
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

export default Signup;
