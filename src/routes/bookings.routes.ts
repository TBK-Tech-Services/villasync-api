import { Router } from "express";
import {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  exportBookings
} from "../controllers/bookings.controllers.ts";

const router = Router();

// API endpoints
router.get("/", getAllBookings);  
router.post("/", addBooking);  
router.put("/:id", updateBooking);  
router.delete("/:id", deleteBooking);  
router.get("/export", exportBookings);  

export default router;