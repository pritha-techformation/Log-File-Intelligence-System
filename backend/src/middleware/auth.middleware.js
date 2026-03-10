// middleware/auth.middleware.js

// import jsonwebtoken
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {

  // get token from header
  const token = req.headers.authorization?.split(" ")[1];
  // if no token, return 401
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {

    // verify token and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {

    // if token is invalid, return 401
    res.status(401).json({ message: "Invalid token" });
  }
};

