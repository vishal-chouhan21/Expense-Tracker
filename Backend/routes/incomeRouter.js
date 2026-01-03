import express from "express";
import { addIncome, editIncome, getIncome } from "../controllers/incomeController.js";
import { userAuth } from "../middleware/userAuthMiddleware.js";

const incomeRouter = express.Router();


incomeRouter.post("/add-income", userAuth, addIncome);
incomeRouter.get("/get-income", userAuth, getIncome);
incomeRouter.put("/edit-income/:id", userAuth, editIncome);

export default incomeRouter;