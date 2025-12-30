import express from "express";
import { sendResetOtp, verifyResetOtp } from "../controllers/forgotPasswordController.js";

const forgotRouter = express.Router();

forgotRouter.post("/send-otp", sendResetOtp);
forgotRouter.post("/verify-otp", verifyResetOtp);

export default forgotRouter;
