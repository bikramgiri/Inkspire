const { userRegister, userLogin, userLogout, forgotPassword, verifyOTP, resetPassword } = require("../../controller/auth/authController")
const catchError = require("../../services/catchError")

const router = require("express").Router()

router.route("/register").post(catchError(userRegister))
router.route("/login").post(catchError(userLogin))
router.route("/logout").post(catchError(userLogout))
router.route("/forgot-password").post(catchError(forgotPassword))
router.route("/verify-otp").post(catchError(verifyOTP))
router.route("/reset-password").post(catchError(resetPassword))

module.exports= router