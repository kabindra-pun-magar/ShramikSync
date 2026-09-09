import express from "express";

import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ========================================
// GET ALL USERS
// ADMIN ONLY
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getUsers
);

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

// ========================================
// UPDATE USER
// ADMIN ONLY
// PUT /api/users/:id
// ========================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateUser
);

export default router;