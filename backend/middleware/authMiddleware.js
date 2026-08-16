import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Expected format:
    // Authorization: Bearer <token>
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach authenticated user information
    // to the request object
    req.user = decoded;

    // Continue to the protected route
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};