import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

// ========================================
// GET ALL USERS
// ADMIN + SUPER_ADMIN
// ========================================

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
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
// ADMIN + SUPER_ADMIN
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

    const userRole = role
      ? role.trim().toUpperCase()
      : "USER";

    if (!["USER", "ADMIN"].includes(userRole)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Only USER or ADMIN can be created.",
      });
    }

    // ========================================
    // ROLE HIERARCHY
    // ========================================

    // ADMIN can create USER only.
    if (
      req.user.role === "ADMIN" &&
      userRole !== "USER"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "ADMIN users can only create USER accounts.",
      });
    }

    // Only SUPER_ADMIN can create ADMIN.
    if (
      userRole === "ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can create ADMIN accounts.",
      });
    }

    // SUPER_ADMIN accounts cannot be created
    // through normal User Management.
    if (userRole === "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message:
          "SUPER_ADMIN accounts cannot be created through user management.",
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
        isActive: true,
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
        isActive: user.isActive,
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
// ADMIN + SUPER_ADMIN
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

    const {
      name,
      email,
      role,
    } = req.body;

    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, and role are required.",
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

    if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Role must be USER, ADMIN, or SUPER_ADMIN.",
      });
    }

    // ========================================
    // FIND TARGET USER
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
    // PREVENT SELF ROLE CHANGE
    // ========================================

    if (
      userId === req.user.userId &&
      normalizedRole !== existingUser.role
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    // ========================================
    // ADMIN PERMISSIONS
    // ========================================

    if (req.user.role === "ADMIN") {
      // ADMIN can edit USER accounts only.
      if (existingUser.role !== "USER") {
        return res.status(403).json({
          success: false,
          message:
            "ADMIN users can only modify USER accounts.",
        });
      }

      // ADMIN cannot promote USER → ADMIN.
      if (normalizedRole !== "USER") {
        return res.status(403).json({
          success: false,
          message:
            "ADMIN users cannot change user roles.",
        });
      }
    }

    // ========================================
    // PROTECT SUPER_ADMIN
    // ========================================

    if (
      existingUser.role === "SUPER_ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to modify a SUPER_ADMIN account.",
      });
    }

    // ========================================
    // PREVENT CREATING / ASSIGNING
    // SUPER_ADMIN THROUGH USER MANAGEMENT
    // ========================================

    if (
      normalizedRole === "SUPER_ADMIN" &&
      existingUser.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "SUPER_ADMIN role cannot be assigned through user management.",
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

    if (
      emailOwner &&
      emailOwner.id !== userId
    ) {
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
        isActive: true,
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

// ========================================
// UPDATE USER STATUS
// ADMIN + SUPER_ADMIN
// PATCH /api/users/:id/status
// ========================================

export const updateUserStatus = async (req, res) => {
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

    const { isActive } = req.body;

    // ========================================
    // VALIDATE STATUS
    // ========================================

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean value.",
      });
    }

    // ========================================
    // FIND USER
    // ========================================

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ========================================
    // PREVENT SELF-DEACTIVATION
    // ========================================

    if (
      userId === req.user.userId &&
      isActive === false
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot deactivate your own account.",
      });
    }

    // ========================================
    // ADMIN PERMISSIONS
    // ========================================

    if (req.user.role === "ADMIN") {
      // ADMIN can activate/deactivate USER only.
      if (user.role !== "USER") {
        return res.status(403).json({
          success: false,
          message:
            "ADMIN users can only change the status of USER accounts.",
        });
      }
    }

    // ========================================
    // PROTECT SUPER_ADMIN
    // ========================================

    if (
      user.role === "SUPER_ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to modify a SUPER_ADMIN account.",
      });
    }

    // ========================================
    // UPDATE STATUS
    // ========================================

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update user status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user status.",
    });
  }
};