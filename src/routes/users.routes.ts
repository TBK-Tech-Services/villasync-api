import { Router } from "express";
import {getAllUsers} from "../controllers/users.controllers.ts";

const router = Router();

// Users Endpoints
router.get("/", getAllUsers);  

export default router;