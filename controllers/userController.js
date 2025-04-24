const User = require("../model/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res
        .status(400)
        .json({ message: "Email already registered,try different email" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error creating user", error.message);

    return res
      .status(500)
      .json({ message: "Server error- create User", error: error.message });
  }
};

//Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email not found,plz login with correct email" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ message: "Login  Successful", token, user });
  } catch (error) {
    console.error("Error Login user", error.message);

    return res
      .status(500)
      .json({ message: "Server error- Login User", error: error.message });
  }
};

exports.getAUser = async (req, res) => {
  try {
    const { id } = req.params;

    const getUser = await User.findById(id);
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.id !== id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    return res.status(200).json({ message: "User found by Id", getUser });
  } catch (error) {
    console.error("Error getting user", error.message);

    return res
      .status(500)
      .json({ message: "Server error- Get a User", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id) {
    //   return res.status(403).json({ message: "Invalid id" });
    // }
    if (req.user.id !== id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", updateUser });
  } catch (error) {
    console.error("Error updating user", error.message);
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    const delUser = await User.findByIdAndDelete(id);

    if (!delUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", delUser });
  } catch (error) {
    console.error("Error deleting user", error.message);
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.checkUser = async (req, res) => {
  try {
    // Find user and exclude password field
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("req.user", user.email);

    res.json(user);
  } catch (error) {
    console.error("Error checking user", error.message);
    return res
      .status(500)
      .json({ message: "Error checking user", error: error.message });
  }
};
