import { Router } from "express";
import {
  getGeneralSettings,
  updateGeneralSettings,
  inviteNewUser,
  updateUser,
  getAllPermissions,
  getAllRoles,
  addGeneralSettings,
  assignVillasToOwner,
  updateOwnerVillaAssignments,
  unassignSpecificVilla,
  unassignAllVillasFromOwner,
  getAllOwners,
  getAllOwnersWithVillas,
  getVillaOwnerManagementStats
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
router.post("/villa-owner-management/assign" , assignVillasToOwner);
router.patch("/villa-owner-management/assign" , updateOwnerVillaAssignments);
router.delete("/villa-owner-management/unassign-villa/:villaId/:ownerId" , unassignSpecificVilla);
router.delete("/villa-owner-management/unassign-owner/:ownerId" , unassignAllVillasFromOwner);
router.get("/villa-owner-management/owners" , getAllOwners);
router.get("/villa-owner-management/owners-with-villas" , getAllOwnersWithVillas);
router.get("/villa-owner-management/stats" , getVillaOwnerManagementStats);

export default router;