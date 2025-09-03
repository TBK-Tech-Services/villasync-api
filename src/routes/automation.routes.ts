import { Router } from "express";

const router = Router();

// API endpoints
router.get("/login", (req, res) => {
    res.send("Login route");
});  

export default router;