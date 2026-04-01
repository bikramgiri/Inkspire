const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
      select: false, // Don't return OTP by default
    },
    otpGeneratedTime: {
      type: Date,
      default: null,
      select: false, // Don't return OTP generated time by default
    },
    resetToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
