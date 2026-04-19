import express from "express";
import { registerForEvent, getMyRegistrations } from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my", protect, getMyRegistrations);
router.post("/", registerForEvent);

export default router;