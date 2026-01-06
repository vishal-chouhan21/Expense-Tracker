import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if(!name || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if(password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ phone });
    if(existingUser) {
      return res.status(409).json({ success: false, message: "User with this phone number already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phone, password: hashedPassword, role: 'user' });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, phone: newUser.phone },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// User Login
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if(!phone || !password) {
      return res.status(400).json({ success: false, message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if(!user) {
      return res.status(401).json({ success: false, message: "Invalid phone" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    if(!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}