const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

const checkAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Token not found or expired" });
    }
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    console.log(user);

    if (!decoded) {
      res
        .status(401)
        .json({ message: "Not authorized user- token not matching" });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Authorization error", error: error.message });
  }
};

module.exports = checkAuth;
