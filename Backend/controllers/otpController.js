import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcrypt";


export const sendOtp = async (req, res) => {
  try {
    const {phone} = req.body;

    const generateOtp = () =>
       Math.floor(100000 + Math.random() * 900000).toString();

    //check
    const existingUser = await User.findOne({phone});
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "Phone Number Already Registered",
      });
    }

    const otp = generateOtp();

    // Delete previous OTPs
    await Otp.deleteMany({phone});

    // Save New Otp
    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5*60*1000), // 5 min
    });

    console.log("OTP", otp);
    
    res.status(200).json({
      success: true,
      message: "OTP Sent to phone number",
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const {name, phone, password, otp} = req.body;

    //Find Otp
    const otpRecord = await Otp.findOne({phone, otp});
    if(!otpRecord){
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check Otp Expiry
    if(otpRecord.expiresAt < new Date()){
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user 
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
    });

    // Delete Otp after success
    await Otp.deleteMany({phone});

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
};
