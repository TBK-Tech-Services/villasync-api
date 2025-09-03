import { Router } from "express";
import {
  getGeneralSettings,
  updateGeneralSettings,
  getAllVillasSettings,
  updateVillaSettings,
  updateBackupSettings,
  exportAllData
} from "../controllers/settings.controllers.ts";

const router = Router();

// API endpoints
router.get("/general", getGeneralSettings);  
router.put("/general", updateGeneralSettings);  
router.get("/villas", getAllVillasSettings);  
router.put("/villas/:id", updateVillaSettings);  
router.put("/backup", updateBackupSettings);  
router.get("/export", exportAllData);  

export default router;