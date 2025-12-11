import { Router } from "express";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getAllExpenseCategories,
  getExpense,
  generateExpenseReport
} from "../controllers/expenses.controllers.ts";

const router = Router();

// Expense Endpoints
router.post("/", addExpense);
router.get("/report", generateExpenseReport);
router.put("/:id", updateExpense);
router.get("/categories", getAllExpenseCategories);
router.delete("/:id", deleteExpense);
router.get("/:id", getExpense);
router.get("/", getAllExpenses);

export default router;