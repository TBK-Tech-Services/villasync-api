import { Router } from "express";
import {
  getAllUsers,
  updateUserRole,
  inviteNewUser
} from "../controllers/users.controllers.ts";

const router = Router();

// API endpoints
router.get("/", getAllUsers);  
router.put("/:id/role", updateUserRole);  
router.post("/invite", inviteNewUser);  

export default router;