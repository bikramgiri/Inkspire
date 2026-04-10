import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaLock,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Building2Icon,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  UserIcon,
  UserPlus,
} from "lucide-react";

const AuthForm = ({
  type = "login || register",
  onSubmit,
  onChange,
  values,
  // setValues,
  errors,
  // passwordStrength,
  // passwordChecks,
  allChecksPassed,
  // ValidationCheck,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center justify-items-center py-4 px-4 min-h-screen">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="hidden lg:flex flex-col justify-center p-12 bg-[#6366f1] text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>

            <div className="relative z-10">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">I</span>
                </div>
                <h2 className="text-3xl font-bold">Inkspire</h2>
              </Link>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {type === "login"
                  ? "Welcome Back to Your Inkspire Hub"
                  : "Start Your Journey Today!"}
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                {type === "login"
                  ? "Write, share, and explore powerful ideas. Publish your stories, reach readers worldwide—your voice starts here."
                  : " Share your ideas and explore insightful stories on Inkspire. Write, publish, and connect with readers—your voice matters here. ✍️"}
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {type === "login" ? "💬" : "📝"}
                  </div>
                  <span className="font-medium">
                    {type === "login"
                      ? "Engage with Community"
                      : "Easy Article Publishing"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {type === "login" ? "🔍" : "🌍"}
                  </div>
                  <span className="font-medium">
                    {type === "login"
                      ? "Smart Content Discovery"
                      : "Global Reader Reach"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {type === "login" ? "🔒" : "📊"}
                  </div>
                  <span className="font-medium">
                    {type === "login"
                      ? "Secure & Fast Login"
                      : "Writer Insights & Analytics"}
                  </span>
                </div>
                {/* <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {type === "login" ? "✅" : "📊"}
                  </div>
                  <span className="font-medium">
                    {type === "login"
                      ? "Personalized Dashboard"
                      : "Hostel Owner Management Dashboard"}
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Form Section  */}
          <div className="p-6 flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">I</span>
              </div>
              <h2 className="text-2xl font-bold">Inkspire</h2>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {type === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {type === "login"
                  ? "Welcome back! Please enter your details."
                  : "Join Inkspire and start your journey with us."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {type !== "login" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={values.username}
                        onChange={onChange}
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 mt-6 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                    placeholder="john@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-2.5 border rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                      errors.password
                        ? "border-red-500"
                        : values.password && allChecksPassed
                          ? "border-indigo-500"
                          : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* {type !== "login" && (
                  <>
                    {values.password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">
                            Password Strength
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              passwordStrength.label === "Strong"
                                ? "text-indigo-600"
                                : passwordStrength.label === "Good"
                                  ? "text-yellow-600"
                                  : passwordStrength.label === "Fair"
                                    ? "text-orange-600"
                                    : "text-red-600"
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: passwordStrength.width }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {(values.passwordFocused || values.password) && (
                      <div className=" mt-2 bg-gray-50 rounded-xl space-y-2">
                        <p className="text-xs font-semibold text-gray-600">
                          Password Requirements:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <ValidationCheck
                            passed={passwordChecks.minLength}
                            label="At least 8 characters"
                          />
                          <ValidationCheck
                            passed={
                              passwordChecks.hasUppercase &&
                              passwordChecks.hasLowercase
                            }
                            label="One uppercase and lowercase letter"
                          />
                          <ValidationCheck
                            passed={passwordChecks.hasSpecialCharacter}
                            label="One special character"
                          />
                          <ValidationCheck
                            passed={passwordChecks.hasNumber}
                            label="One number"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )} */}
              </div>

              <div
                className={`${type === "login" ? "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" : "flex justify-start"}`}
              >
                <div className="flex items-start mb-1">
                  <input
                    type="checkbox"
                    id="rememberandterms"
                    className="mt-1.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="rememberandterms"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    {type === "login" ? (
                      <>Remember me</>
                    ) : (
                      <>
                        I agree to the
                        <Link
                          to="/terms"
                          className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                        >
                          {" "}
                          Terms of Services{" "}
                        </Link>
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </>
                    )}
                  </label>
                </div>
                {type === "login" && (
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {type === "login" ? (
                  <LogIn className="size-5" />
                ) : (
                  <UserPlus className="size-5" />
                )}
                {type === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="mt-3 text-center text-sm text-gray-600">
              {type === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                to={type === "login" ? "/register" : "/login"}
                className="text-indigo-600 font-medium hover:underline"
              >
                {type === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>

            {/* Social Signup */}
            <div className="mt-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or {type === "login" ? "sign in" : "sign up"} with
                  </span>
                </div>
              </div>

              {/* Responsive social buttons - stack on mobile, grid on sm+ */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Google */}
                <button className="cursor-pointer flex items-center justify-center gap-3 bg-indigo-200 border border-gray-300 rounded-lg py-3 px-4 shadow-sm hover:bg-indigo-300 transition-colors text-sm font-medium text-gray-700">
                  <FcGoogle className="h-6 w-6 flex-shrink-0" />
                  Google
                </button>

                {/* Facebook */}
                <button className="cursor-pointer flex items-center justify-center gap-3 bg-indigo-200 border border-gray-300 rounded-lg py-3 px-4 shadow-sm hover:bg-indigo-300 transition-colors text-sm font-medium text-gray-700">
                  <FaFacebook className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
