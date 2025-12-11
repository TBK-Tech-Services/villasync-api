import { Router } from "express";
import {
  getAllBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  getABooking,
  searchAndFilterBookings,
  updateBookingStatus,
  updatePaymentStatus,
  generateVoucher,
  sendVoucherEmail,
  exportBookings
} from "../controllers/bookings.controllers.ts";

const router = Router();

// Bookings Endpoints
router.post("/", addBooking);
router.get("/search", searchAndFilterBookings);
router.get("/export", exportBookings);
router.get("/", getAllBookings);
router.put("/:id", updateBooking);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", deleteBooking);
router.get("/:id", getABooking);
router.post("/:bookingId/generate-voucher", generateVoucher);
router.post("/:bookingId/send-voucher-email", sendVoucherEmail);

export default router;