import express from "express";
import { getUserProfile } from "../controllers/profileController.js";
import { userAuth } from "../middleware/userAuthMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/get-user-profile", userAuth, getUserProfile);

export default profileRouter;


