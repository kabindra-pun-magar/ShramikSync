import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

// ========================================
// GET ALL USERS
// ADMIN ONLY
// ========================================

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

// ========================================
// CREATE USER
// ADMIN ONLY
// ========================================

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
      message:
        "Something went wrong while creating the user.",
    });
  }
};

// ========================================
// UPDATE USER
// ADMIN ONLY
// PUT /api/users/:id
// ========================================

export const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    // ========================================
    // VALIDATE USER ID
    // ========================================

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const { name, email, role } = req.body;

    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required.",
      });
    }

    // ========================================
    // NORMALIZE INPUT
    // ========================================

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = role.trim().toUpperCase();

    // ========================================
    // VALIDATE NAME
    // ========================================

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    // ========================================
    // VALIDATE EMAIL
    // ========================================

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty.",
      });
    }

    // ========================================
    // VALIDATE ROLE
    // ========================================

    if (!["USER", "ADMIN"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Role must be USER or ADMIN.",
      });
    }

    // ========================================
    // FIND USER
    // ========================================

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ========================================
    // CHECK EMAIL DUPLICATE
    // ========================================

    const emailOwner = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (emailOwner && emailOwner.id !== userId) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered by another user.",
      });
    }

    // ========================================
    // UPDATE USER
    // ========================================

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: normalizedName,
        email: normalizedEmail,
        role: normalizedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ========================================
    // RETURN UPDATED USER
    // ========================================

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
};