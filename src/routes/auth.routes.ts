import { Router } from "express";
import { changePassword, forgotPassword, loginUser, logoutUser, signupUser } from "../controllers/auth.controllers.ts";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);  

export default router;