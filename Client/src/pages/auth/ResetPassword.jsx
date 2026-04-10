import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../store/auth/authSlice";
import { Eye, EyeOff, Loader2, Lock, Mail, Key } from "lucide-react";
import { toast } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES } from "../../global/status";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, resetToken } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    general: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "bg-gray-200",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));

    if (name === "newPassword" || name === "confirmPassword") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "bg-gray-200" });
      return;
    }

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "";
    let color = "";

    switch (true) {
      case score <= 2:
        label = "Weak";
        color = "bg-red-500";
        break;
      case score === 3:
        label = "Fair";
        color = "bg-orange-500";
        break;
      case score === 4:
        label = "Good";
        color = "bg-yellow-500";
        break;
      case score === 5:
        label = "Strong";
        color = "bg-green-500";
        break;
      case score >= 6:
        label = "Very Strong";
        color = "bg-indigo-600";
        break;
      default:
        label = "";
        color = "bg-gray-200";
    }

    setPasswordStrength({ score, label, color });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "", general: "" });

    let hasError = false;
    const newErrors = { newPassword: "", confirmPassword: "", general: "" };

    if (!userData.newPassword) {
      newErrors.newPassword = "New password is required";
      toast(newErrors.newPassword, "error");
      hasError = true;
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      toast(newErrors.confirmPassword, "error");
      hasError = true;
    }

    if (hasError) return;

    if (userData.newPassword !== userData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      toast("Passwords do not match", "error");
      return;
    }

    dispatch(resetPassword({ ...userData, resetToken }))
      .then(() => {
        toast("Password changed successfully!", "success");
        setUserData({ newPassword: "", confirmPassword: "" });
        setErrors({ newPassword: "", confirmPassword: "", general: "" });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          "Failed to reset password.";

        if (
          errMsg &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errMsg.field;
          const msg = errMsg || "Password reset failed";

          if (field && ["newPassword", "confirmPassword", "general"].includes(field)) {
            setErrors((prev) => ({ ...prev, [field]: msg }));
            toast(msg, "error");
          } else {
            setErrors((prev) => ({ ...prev, general: msg }));
            toast(msg, "error");
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Something went wrong.",
          }));
          toast("Something went wrong.", "error");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-6 py-6 md:py-7">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200">
        <div className="text-center mb-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-9 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <span className="text-3xl font-bold bg-indigo-500 bg-clip-text text-transparent">
              Inkspire
            </span>
          </Link>
          <p className="text-lg sm:text-lg font-bold text-gray-700 mb-1.5">
            Reset Your Password
          </p>
        </div>

        {errors.general && (
          <p className="text-center text-red-600 font-medium mb-6 bg-red-50 py-3 rounded-lg">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          {/* <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <Mail className="absolute left-3 top-12 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="username@gmail.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
              OTP
            </label>
            <Key className="absolute left-3 top-12 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              id="otp"
              name="otp"
              value={userData.otp}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="Enter the OTP sent to your email"
            />
          </div> */}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
             <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              {showNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
            </div>

            {/* {userData.newPassword && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <p
                  className={`text-sm ${
                    passwordStrength.label === "Weak"
                      ? "text-red-600"
                      : passwordStrength.label === "Fair"
                      ? "text-orange-600"
                      : passwordStrength.label === "Good"
                      ? "text-yellow-600"
                      : passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                >
                  Password Strength: {passwordStrength.label || "Enter password"}
                </p>
              </div>
            )} */}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
         <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
            </div>

            {/* {userData.confirmPassword && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <p
                  className={`text-sm ${
                    passwordStrength.label === "Weak"
                      ? "text-red-600"
                      : passwordStrength.label === "Fair"
                      ? "text-orange-600"
                      : passwordStrength.label === "Good"
                      ? "text-yellow-600"
                      : passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                >
                  Password Strength: {passwordStrength.label || "Enter password"}
                </p>
              </div>
            )} */}
          </div>

          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === STATUSES.LOADING ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;