import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcrypt";

// Step 1: Send OTP for password reset
export const sendResetOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    console.log("Reset OTP:", otp); // Dev only

    res.status(200).json({ success: true, message: "OTP sent for password reset" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Step 2: Verify OTP & reset password
export const verifyResetOtp = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ phone }, { password: hashedPassword });

    await Otp.deleteMany({ phone });

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
