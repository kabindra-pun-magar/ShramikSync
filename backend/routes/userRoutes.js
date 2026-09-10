import express from "express";

import {
  createUser,
  getUsers,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ========================================
// GET ALL USERS
// ADMIN + SUPER_ADMIN
// ========================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  getUsers
);

// ========================================
// CREATE USER
// ADMIN + SUPER_ADMIN
// ========================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  createUser
);

// ========================================
// UPDATE USER
// ADMIN + SUPER_ADMIN
// PUT /api/users/:id
// ========================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateUser
);

// ========================================
// ACTIVATE / DEACTIVATE USER
// ADMIN + SUPER_ADMIN
// PATCH /api/users/:id/status
// ========================================

router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  updateUserStatus
);

export default router;