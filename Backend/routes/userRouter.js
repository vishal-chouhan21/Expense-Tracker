import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuthMiddleware.js";

const userRouter = express.Router();

// User Registration
userRouter.post("/register", registerUser);

// User Login
userRouter.post("/login", loginUser);

// verify user authentication
userRouter.get("/verify", userAuth, (req, res) => {
  return res.status(200).json({ success: true, message: "User is authenticated", user: req.user });
});

userRouter.get("/home", (req, res) => {
  return res.status(200).json({ success: true, message: "Welcome to the User Home Page" });
});

export default userRouter;