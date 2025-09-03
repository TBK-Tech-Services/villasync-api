import { Router } from "express";
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getAllVillasForExpenses
} from "../controllers/expenses.controllers.ts";

const router = Router();

// API endpoints
router.get("/", getAllExpenses);  
router.post("/", addExpense);  
router.put("/:id", updateExpense);  
router.delete("/:id", deleteExpense);  
router.get("/villas", getAllVillasForExpenses);  

export default router;