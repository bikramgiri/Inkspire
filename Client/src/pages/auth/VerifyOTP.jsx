import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../store/auth/authSlice";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../utils/toast";
import { STATUSES } from "../../global/status";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({ otp: "", general: "" });
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Allow only single digit
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors({ otp: "", general: "" });

    // Move to next box when digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move back on backspace if current box is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus the next empty box or last box
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ otp: "", general: "" });

    const otpValue = otp.join("");

    if (!otpValue) {
      toast("OTP is required", "error");
      setErrors({ otp: "OTP is required", general: "" });
      return;
    }

    if (otpValue.length !== 6) {
      toast("OTP must be a 6-digit number", "error");
      setErrors({ otp: "OTP must be a 6-digit number", general: "" });
      return;
    }

    dispatch(verifyOTP({ otp: otpValue }))
      .then(() => {
        toast("OTP verified successfully!", "success");
        setOtp(["", "", "", "", "", ""]);
        setErrors({ otp: "", general: "" });
        setTimeout(() => navigate("/reset-password"), 2000);
      })
      .catch((error) => {
        const errData = error?.response?.data;
        const msg = errData?.message || "Failed to verify OTP.";
        const field = errData?.field;

        if (field && ["otp", "general"].includes(field)) {
          setErrors((prev) => ({ ...prev, [field]: msg }));
        } else {
          setErrors((prev) => ({ ...prev, general: msg }));
        }
        toast(msg, "error");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200
        shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
        dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
        hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
        dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
        transition-shadow duration-500">

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-9 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <span className="text-3xl font-bold bg-indigo-500 bg-clip-text text-transparent">
              Inkspire
            </span>
          </Link>
          <p className="text-lg font-bold text-gray-700 mb-1.5">Verify OTP</p>
          <p className="text-sm text-gray-500">Enter the 6-digit code sent to your email</p>
        </div>

        {errors.general && (
          <p className="text-center text-red-600 font-medium mb-6 bg-red-50 py-3 rounded-lg text-sm">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              One-Time Password
            </label>

            {/* 6 OTP boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-12 text-center text-lg font-semibold border rounded-lg outline-none transition-all
                    text-gray-900 placeholder-gray-300
                    ${errors.otp
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-300"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300"
                    }
                    ${digit ? "bg-indigo-50 border-indigo-400" : "bg-white"}
                  `}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === STATUSES.LOADING ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              "Verify OTP"
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

export default VerifyOTP;