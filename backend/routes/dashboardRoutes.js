import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Protected Dashboard API
 * GET /api/dashboard
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    // req.user comes from authenticateToken()
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Currently we only have the User model.
    // Candidate/Employer/etc. statistics will be added
    // when those database models are created.
    const totalUsers = await prisma.user.count();

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully.",
      user,
      stats: {
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data.",
    });
  }
});

export default router;