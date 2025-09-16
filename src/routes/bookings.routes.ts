import { Router } from "express";
import {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  exportBookings,
  getABooking
} from "../controllers/bookings.controllers.ts";

const router = Router();

// Bookings Endpoints
router.post("/", addBooking);  
router.get("/", getAllBookings);  
router.get("/:id", getABooking);  
router.put("/:id", updateBooking);  
router.delete("/:id", deleteBooking);  
router.get("/export", exportBookings);  

export default router;