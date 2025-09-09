import { Router } from "express";
import { changePassword, createAdmin, forgotPassword, loginUser, logoutUser } from "../controllers/auth.controllers.ts";

const router = Router();

router.post("/create-admin", createAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);  

export default router;