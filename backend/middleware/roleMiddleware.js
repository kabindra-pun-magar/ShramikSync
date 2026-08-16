export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // User must already be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check whether user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    // User has the required role
    next();
  };
};