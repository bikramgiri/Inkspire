const User = require("../../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../../services/sendEmail");

// User Register
exports.userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({
      message: "Username must be between 3 and 30 characters long.",
      field: "username",
    });
  }

  // unique username check
  const existingUsername = await User.findOne({ username: username });
  if (existingUsername) {
    return res.status(400).json({
      message: "Username is already taken.",
      field: "username",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
      field: "email",
    });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({
      message: "Email is already registered.",
      field: "email",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters.",
      field: "password",
    });
  }
    const userData = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    // avatar: '',
  });

  // Remove password from response
  const userResponse = userData.toObject();
  delete userResponse.password;

  res.status(201).json({
    message: "Registered successful!",
    data: userResponse
  });
};

// User Login
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        field: "general",
      });
    }

    const existingUser = await User.findOne({ email: email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({
        message: "User not found with this email.",
        field: "email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Wrong password.",
        field: "password",
      });
    }

    const token = jwt.sign({ 
      userId: existingUser._id },
      process.env.JWT_SECRET,{
        expiresIn: "2d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, 
    });

  // Remove password from response
  const userResponse = existingUser.toObject();
  delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      data: userResponse,
      token: token,
    });
  };

  
// User Logout
exports.userLogout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
      field: "email",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
      field: "email",
    });
  }

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).json({
      message: "User not found with this email.",
      field: "email",
    });
  }

  const generateOTP = (crypto.randomInt(0, 999999)).toString().padStart(6, "0");

  existingUser.otp = generateOTP;
  existingUser.otpGeneratedTime = Date.now(); 
  await existingUser.save();

  await sendEmail({
    email,
    subject: "Password Reset OTP",
    otp: generateOTP,
  });
 
  res.status(200).json({
    message: "OTP has been sent to your email.",
    data: existingUser.email,
  });
};

// *Verify OTP 
exports.verifyOTP = async (req, res) => {
  const {otp } = req.body;
  if (!otp) {
    return res.status(400).json({
      message: "OTP is required.",
      field: "general",
    });
  }

  if (otp.length !== 6) {
    return res.status(400).json({
      message: "OTP must be 6 digits.",
      field: "otp",
    });
  }

  const existingUser = await User.findOne({otp }).select("+otp +otpGeneratedTime"); 
  if (!existingUser) {
    return res.status(400).json({
      message: "Wrong OTP.",
      field: "otp",
    });
  }

  const currentTime = Date.now();
  const otpGeneratedTime = existingUser.otpGeneratedTime.getTime(); 
  const timeDifference = currentTime - otpGeneratedTime;
  const otpExpiryTime = 2 * 60 * 1000; 
  
  if (timeDifference > otpExpiryTime) {
    return res.status(400).json({
      message: "OTP has expired.",
      field: "otp",
    });
  }

  // Issue a short-lived reset token after OTP verified
  const resetToken = jwt.sign(
    { userId: existingUser._id },
    process.env.JWT_RESET_PASSWORD_SECRET,
    { expiresIn: "5m" } 
  );

  existingUser.otp = null; 
  existingUser.otpGeneratedTime = null;
  existingUser.resetToken = resetToken;
  await existingUser.save();

  res.status(200).json({
    message: "OTP verified successfully.",
    data: resetToken 
  });
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;
  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide reset token and new password.",
      field: "general",
    });
  }

    // Verify the reset token
  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD_SECRET);
  } catch (err) {
    return res.status(400).json({
      message: "Reset token is invalid or has expired.",
      field: "general",
    });
  }

   // Find user by ID from token AND match stored resetToken
  const existingUser = await User.findById(decoded.userId).select("+resetToken");
  if (!existingUser || existingUser.resetToken !== resetToken) {
    return res.status(400).json({
      message: "Reset token is invalid or already used.",
      field: "general",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters.",
      field: "password",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password do not match.",
      field: "confirmPassword",
    });
  }

  existingUser.password = bcrypt.hashSync(newPassword, 8);
  existingUser.resetToken = null; // Clear the reset token after use
  await existingUser.save();

  res.status(200).json({
    message: "Password has been reset successfully.",
  });
};
