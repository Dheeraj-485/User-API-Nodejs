const express = require("express");
const db = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db();

app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
