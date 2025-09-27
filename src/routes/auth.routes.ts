import { Router } from "express";
import { createAdmin, loginUser, logoutUser } from "../controllers/auth.controllers.ts";

const router = Router();

// Auth Endpoints
router.post("/create-admin", createAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;