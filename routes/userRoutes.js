const express = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  checkUser,
  getAUser,
} = require("../controllers/userController");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/me", checkAuth, checkUser)
  .get("/get/:id", checkAuth, getAUser)
  .put("/update/:id", checkAuth, updateUser)
  .delete("/delete/:id", checkAuth, deleteUser);

module.exports = router;
