const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};
