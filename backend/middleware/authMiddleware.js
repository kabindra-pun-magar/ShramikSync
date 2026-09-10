import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ========================================
    // CHECK AUTHORIZATION HEADER
    // ========================================

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    // ========================================
    // VALIDATE BEARER FORMAT
    // ========================================

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    // ========================================
    // VERIFY JWT
    // ========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ========================================
    // FIND CURRENT USER
    // ========================================

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    // ========================================
    // USER NO LONGER EXISTS
    // ========================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    // ========================================
    // CHECK CURRENT ACCOUNT STATUS
    // ========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // ========================================
    // ATTACH CURRENT DATABASE USER
    // ========================================

    req.user = {
      userId: user.id,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    console.error(
      "JWT authentication error:",
      error
    );

    // ========================================
    // TOKEN EXPIRED
    // ========================================

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    // ========================================
    // INVALID TOKEN
    // ========================================

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // ========================================
    // DATABASE / OTHER AUTH ERROR
    // ========================================

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};