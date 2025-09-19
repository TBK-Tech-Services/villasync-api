import { Router } from "express";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getAllVillasForExpenses,
  getAllExpenseCategories,
  getExpense
} from "../controllers/expenses.controllers.ts";

const router = Router();

// Expense Endpoints
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.get("/categories", getAllExpenseCategories);
router.delete("/:id", deleteExpense);
router.get("/:id", getExpense);
router.get("/", getAllExpenses);
router.get("/villas", getAllVillasForExpenses);  

export default router;