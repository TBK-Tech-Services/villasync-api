import { Router } from "express";
import {
  getAllVillas,
  addVilla,
  getSingleVilla,
  updateVilla,
  getVillaRecentBookings,
  getVillaMonthlyRevenue,
  getVillaAvailability,
  searchAndFilterVillas,
  getAllAmenityCategories
} from "../controllers/villas.controllers.ts";

const router = Router();

// Villas Endpoints
router.get("/search", searchAndFilterVillas);    
router.post("/", addVilla);  
router.put("/:id", updateVilla);
router.get("/", getAllVillas);  
router.get("/:id", getSingleVilla);
router.get("/amenities/categories", getAllAmenityCategories);
router.get("/:id/bookings", getVillaRecentBookings);  
router.get("/:id/revenue", getVillaMonthlyRevenue);  
router.get("/:id/calender", getVillaAvailability);  

export default router;