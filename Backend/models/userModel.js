import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    phone: {type: Number, required: true, unique: true, index: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user', index: true},
  },
  { timestamps: true}
  
);

// Indexing phone number for faster queries
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;