import User from "../models/userModel.js";

// Get user Profile
export const getUserProfile = async (req, res) => {
  try {
    if(!req.user || !req.user.id){
      return res.status(400).json({
        success: false,
        message: "User Not Aunthanticate",
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};