const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if token is sent in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password"); // attach user info to request
      next();
    } catch (error) {
      console.error("JWT Verify Failed:", error);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }
};

module.exports = protect;
