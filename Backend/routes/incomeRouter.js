import express from "express";
import { addIncome, getIncome } from "../controllers/incomeController.js";
import { userAuth } from "../middleware/userAuthMiddleware.js";

const incomeRouter = express.Router();


incomeRouter.post("/add-income", userAuth, addIncome);
incomeRouter.get("/get-income", userAuth, getIncome);

export default incomeRouter;