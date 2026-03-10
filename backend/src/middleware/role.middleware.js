// Role middleware

module.exports = (roles) => (req, res, next) => {

  // Check if user role is in allowed roles
  if (!roles.includes(req.user.role))

    // If not, return 403
    return res.status(403).json({ message: "Forbidden" });
  next();
};