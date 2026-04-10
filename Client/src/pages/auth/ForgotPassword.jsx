import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../store/auth/authSlice";
import { Loader2, Mail, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../utils/toast";
import { STATUSES } from "../../global/status";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    general: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ email: "", general: "" });

    let hasError = false;
    const newErrors = { email: "", general: "" };

    if (!userData.email) {
      newErrors.email = "Email is required";
      hasError = true;
      toast(newErrors.email, "error");
    }

    if (hasError) {

      if (!validateEmail(userData.email)) {
      newErrors.email = "Invalid email format";
      toast(newErrors.email, "error");
      setErrors(newErrors);
      return;
    }
  }

    dispatch(forgotPassword(userData))
      .then(() => {
        toast("OTP sent to your email successfully!", "success");
        setUserData({ email: "" });
        setErrors({ email: "", general: "" });

        setTimeout(() => {
          navigate("/verify-otp");
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          "Failed to send OTP.";

        if (
          errMsg &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errMsg.field;
          const msg = errMsg.message || "OTP sending failed";

          if (field && ["email", "general"].includes(field)) {
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200
      
            shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
            dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
            hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
            dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
  
            transition-shadow duration-500
      "
      >

             <div className="text-center mb-6">
                  <Link to="/" className="inline-flex items-center gap-2 mb-1">
                    <div className="w-9 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">I</span>
                    </div>
                    <span className="text-3xl font-bold bg-indigo-500 bg-clip-text text-transparent">
                      Inkspire
                    </span>
                  </Link>
                  <p className="text-lg sm:text-lg font-bold text-gray-700 mb-1.5">
                    Forgot Password
                  </p>
                </div>

        {errors.general && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <Mail className="absolute left-3 mt-6 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
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

          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="size-5" />
            {status === STATUSES.LOADING ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;