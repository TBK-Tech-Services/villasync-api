import { Router } from "express";
import { createAdmin, loginUser, logoutUser, forgotPassword, resetPassword, changePassword } from "../controllers/auth.controllers.ts";
import { authenticate } from "../middlewares/auth/authenticate.ts";

const router = Router();

// Auth Endpoints
router.post("/create-admin", createAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Password Management Endpoints
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", authenticate, changePassword);

export default router;