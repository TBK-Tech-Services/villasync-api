import { Router } from "express";
import {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  exportBookings,
  getABooking,
  searchAndFilterBookings
} from "../controllers/bookings.controllers.ts";

const router = Router();

// Bookings Endpoints
router.post("/", addBooking);  
router.get("/search", searchAndFilterBookings);  
router.get("/", getAllBookings);  
router.put("/:id", updateBooking);  
router.delete("/:id", deleteBooking);  
router.get("/:id", getABooking);  
router.get("/export", exportBookings);  

export default router;