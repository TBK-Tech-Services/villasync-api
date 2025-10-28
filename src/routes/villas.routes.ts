import { Router } from "express";
import {
  getAllVillas,
  addVilla,
  getSingleVilla,
  updateVilla,
  getVillaRecentBookings,
  getAllAmenityCategories,
  deleteVilla,
  getVillaBookings
} from "../controllers/villas.controllers.ts";

const router = Router();

// Villas Endpoints
router.post("/", addVilla);
router.put("/:id", updateVilla);
router.delete("/:id", deleteVilla);
router.get("/", getAllVillas);  
router.get("/:id", getSingleVilla);
router.get("/amenities/categories", getAllAmenityCategories);
router.get("/:id/recent-bookings", getVillaRecentBookings);  
router.get("/:id/bookings", getVillaBookings);  

export default router;