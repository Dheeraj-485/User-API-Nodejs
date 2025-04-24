const mongoose = require("mongoose");
require("dotenv").config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((error) =>
      console.log({ message: "Error connecting to DB", error: error.message })
    );
};

module.exports = db;
