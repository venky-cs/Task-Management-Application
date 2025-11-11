const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token" });
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized", details: err.message });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ error: "Admin required" });
  next();
};

module.exports = { authenticate, authorizeAdmin };
