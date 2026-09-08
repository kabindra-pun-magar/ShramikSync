import express from "express";

import { createUser } from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ========================================
// CREATE USER
// ADMIN ONLY
// ========================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createUser
);

export default router;