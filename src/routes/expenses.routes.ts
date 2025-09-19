import { Router } from "express";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getAllVillasForExpenses
} from "../controllers/expenses.controllers.ts";

const router = Router();

// Expense Endpoints
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/", getAllExpenses);
router.get("/villas", getAllVillasForExpenses);  

export default router;