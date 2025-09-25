import { Router } from "express";
import {
  getGeneralSettings,
  updateGeneralSettings,
  getAllVillasSettings,
  updateVillaSettings,
  updateBackupSettings,
  exportAllData,
  inviteNewUser,
  updateUser,
  getAllPermissions,
  getAllRoles,
  addGeneralSettings
} from "../controllers/settings.controllers.ts";
import { authenticate } from "../middlewares/auth/authenticate.ts";
import { authorize } from "../middlewares/auth/authorize.ts";

const router = Router();

// Settings Endpoints
router.get("/user-management/roles", authenticate , getAllRoles);  
router.get("/user-management/permissions", authenticate , getAllPermissions);  
router.post("/user-management/invite-user", authenticate , authorize('INVITE_USER') , inviteNewUser);  
router.put("/user-management/update-user" , authenticate , updateUser);
router.post("/general", addGeneralSettings);  
router.put("/general/:id", updateGeneralSettings);  
router.get("/general", getGeneralSettings);  
router.put("/general", authenticate , updateGeneralSettings);  
router.get("/villas", authenticate , getAllVillasSettings);  
router.put("/villas/:id", authenticate , updateVillaSettings);  
router.put("/backup", authenticate , updateBackupSettings);  
router.get("/export", authenticate , exportAllData);  

export default router;