import express from "express";
import {
  addExpense,
  deleteExpense,
  editExpense,
  getExpense
} from "../controllers/expenseController.js";
import { userAuth } from "../middleware/userAuthMiddleware.js";


const expenseRouter = express.Router();

//Add Expense
expenseRouter.post("/add-expense", userAuth, addExpense);

// Get Expense
expenseRouter.get("/get-expense", userAuth, getExpense);

// Delete Expense 
expenseRouter.delete("/delete-expense/:id", userAuth, deleteExpense);

//Edit Expense
expenseRouter.put("/edit-expense/:id", userAuth, editExpense);
export default expenseRouter;