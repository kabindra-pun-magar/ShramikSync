import express from "express";

import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/authController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put(
  "/change-password",
  authenticateToken,
  changePassword
);

export default router;