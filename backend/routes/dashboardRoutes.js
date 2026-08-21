import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * ========================================
 * PROTECTED DASHBOARD API
 * ========================================
 *
 * GET /api/dashboard
 *
 * Returns:
 * - Authenticated user information
 * - Total users
 * - Total candidates created by
 *   the authenticated user
 *
 * Authentication:
 * authenticateToken()
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    // ========================================
    // AUTHENTICATED USER
    // ========================================

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

    // ========================================
    // USER NOT FOUND
    // ========================================

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    // ========================================
    // DASHBOARD STATISTICS
    // ========================================

    /*
     * Total registered users.
     *
     * This is currently a system-wide count.
     */
    const totalUsers = await prisma.user.count();


    /*
     * Total candidates belonging to the
     * authenticated user.
     *
     * This matches the ownership rule used
     * in candidateRoutes.js.
     */
    const totalCandidates =
      await prisma.candidate.count({
        where: {
          createdById: userId,
        },
      });


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Dashboard data retrieved successfully.",

      user,

      stats: {
        totalUsers,
        totalCandidates,
      },
    });

  } catch (error) {

    console.error(
      "Dashboard API error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data.",
    });
  }
});

export default router;