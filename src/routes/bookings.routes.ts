import { Router } from "express";
import {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  getABooking,
  searchAndFilterBookings,
  updateBookingStatus,
  updatePaymentStatus
} from "../controllers/bookings.controllers.ts";

const router = Router();

// Bookings Endpoints
router.post("/", addBooking);
router.get("/search", searchAndFilterBookings);
router.get("/", getAllBookings);
router.put("/:id", updateBooking);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", deleteBooking);
router.get("/:id", getABooking);

export default router;