import { Router } from "express";
import {
  getAllVillas,
  addVilla,
  getSingleVilla,
  updateVilla,
  getVillaRecentBookings,
  getVillaMonthlyRevenue,
  getVillaAvailability
} from "../controllers/villas.controllers.ts";

const router = Router();

// Villas Endpoints
router.get("/", getAllVillas);  
router.post("/", addVilla);  
router.get("/:id", getSingleVilla);  
router.put("/:id", updateVilla);  
router.get("/:id/bookings", getVillaRecentBookings);  
router.get("/:id/revenue", getVillaMonthlyRevenue);  
router.get("/:id/calender", getVillaAvailability);  

export default router;