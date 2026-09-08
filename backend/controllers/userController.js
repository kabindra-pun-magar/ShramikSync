import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password, and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    // ========================================
    // NORMALIZE INPUT
    // ========================================

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // ========================================
    // CHECK EXISTING USER
    // ========================================

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ========================================
    // VALIDATE ROLE
    // ========================================

    const userRole = role || "USER";

    if (!["USER", "ADMIN"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ========================================
    // CREATE USER
    // ========================================

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
      },
    });

    // ========================================
    // RETURN SAFE USER DATA
    // ========================================

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the user.",
    });
  }
};