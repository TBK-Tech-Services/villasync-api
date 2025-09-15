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
router.post("/", addVilla);  
router.put("/:id", updateVilla);
router.get("/", getAllVillas);  
router.get("/:id", getSingleVilla);    
router.get("/:id/bookings", getVillaRecentBookings);  
router.get("/:id/revenue", getVillaMonthlyRevenue);  
router.get("/:id/calender", getVillaAvailability);  

export default router;