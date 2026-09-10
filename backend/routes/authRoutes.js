import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  changePassword,
  refreshAccessToken,
  logout,
  logoutAll,
} from "../controllers/authController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// PUBLIC AUTH ROUTES
// ========================================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logout);

// ========================================
// PROTECTED AUTH ROUTES
// ========================================

router.get(
  "/me",
  authenticateToken,
  getCurrentUser
);

router.put(
  "/change-password",
  authenticateToken,
  changePassword
);

router.post(
  "/logout-all",
  authenticateToken,
  logoutAll
);

export default router;