import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

// ========================================
// REGISTER USER
// PUBLIC
// ========================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    // ========================================
    // CONFIRM PASSWORD
    // ========================================

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // ========================================
    // PASSWORD LENGTH
    // ========================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // ========================================
    // NORMALIZE INPUT
    // ========================================

    const normalizedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty.",
      });
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be empty.",
      });
    }

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
        message: "An account with this email already exists.",
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ========================================
    // CREATE USER
    // PUBLIC REGISTRATION = USER + ACTIVE
    // ========================================

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        isActive: true,
      },
    });

    // ========================================
    // RETURN SAFE USER DATA
    // ========================================

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
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
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
    });
  }
};

// ========================================
// LOGIN USER
// PUBLIC
// ========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail = email.toLowerCase().trim();

    // ========================================
    // FIND USER
    // ========================================

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // ========================================
    // INVALID USER
    // ========================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================
    // VERIFY PASSWORD
    // ========================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================
    // CHECK ACCOUNT STATUS
    // ========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact an administrator.",
      });
    }

    // ========================================
    // CHECK JWT SECRET
    // ========================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    // ========================================
    // CREATE JWT
    // ========================================

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ========================================
    // RETURN SAFE USER DATA
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};

// ========================================
// GET CURRENT USER
// PROTECTED
// ========================================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching user information.",
    });
  }
};

// ========================================
// CHANGE PASSWORD
// PROTECTED
// ========================================

export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    // ========================================
    // CHECK NEW PASSWORD MATCH
    // ========================================

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    // ========================================
    // PASSWORD LENGTH
    // ========================================

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long.",
      });
    }

    // ========================================
    // PREVENT SAME PASSWORD
    // ========================================

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from the current password.",
      });
    }

    // ========================================
    // FIND AUTHENTICATED USER
    // ========================================

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // ========================================
    // VERIFY CURRENT PASSWORD
    // ========================================

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // ========================================
    // HASH NEW PASSWORD
    // ========================================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // ========================================
    // UPDATE PASSWORD
    // ========================================

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while changing the password.",
    });
  }
};