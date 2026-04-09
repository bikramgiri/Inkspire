import React, { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, resetAuthStatus } from '../../store/auth/authSlice'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { toast } from '../../utils/toast'
import { STATUSES } from '../../global/status'

    // Validation Check Item Component
  const ValidationCheck = ({ passed, label }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-all ${
        passed ? "text-indigo-600" : "text-gray-400"
      }`}
    >
      {passed ? <FaCheck className="text-indigo-600" /> : <FaTimes className="text-gray-300" />}
      <span className={passed ? "font-medium" : ""}>{label}</span>
    </div>
  );

  
const Register = () => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const {status} = useSelector((state) => state.auth)

      const[userData, setUserData] = useState({
            username: "",
            email: "",
            password: ""
      })

      const [errors, setErrors] = useState({
            username: "",
            email: "",
            password: "",
            general: ""
      })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

    // Password validation checks
    const passwordChecks = {
    minLength: userData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(userData.password),
    hasLowercase: /[a-z]/.test(userData.password),
    hasSpecialCharacter: /[^A-Za-z0-9]/.test(userData.password),
    hasNumber: /\d/.test(userData.password),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);
  // const checksPassedCount = Object.values(passwordChecks).filter(Boolean).length;

const getPasswordStrength = () => {
  const password = userData.password;
  if (!password) return { label: "", color: "", width: "0%" };

  const length = password.length;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialCharacter,
  ].filter(Boolean).length;

  if (length >= 8 && criteriaMet === 4) {
    return { label: "Strong", color: "bg-indigo-500", width: "100%" };
  }

  if (length >= 5 && length <= 7 && criteriaMet >= 3) {
    return { label: "Good", color: "bg-yellow-500", width: "75%" };
  }

  if (length >= 3 && length <= 4 && criteriaMet >= 2) {
    return { label: "Fair", color: "bg-orange-500", width: "50%" };
  }

  if (length > 0) {
    return { label: "Weak", color: "bg-red-500", width: "25%" };
  }

  return { label: "", color: "", width: "0%" };
};

  const passwordStrength = getPasswordStrength();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validatePassword = (password) => {
      return password.length >= 8;
  }

    const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ username: "", email: "", password: "", general: "" });
    
    
    if (!allChecksPassed) {
      toast("Please meet all password requirements", 'error');
      return;
    }

    let hasError = false;
    const newErrors = { username: "", email: "", password: "", general: "" };

    if (!userData.username) {
      newErrors.username = "Username is required";
      hasError = true;
      toast(newErrors.username, 'error');
    }
    if (!userData.email) {
      newErrors.email = "Email is required";
      hasError = true;
      toast(newErrors.email, 'error');
    }
    if (!userData.password) {
      newErrors.password = "Password is required";
      hasError = true;
      toast(newErrors.password, 'error');
    }

    if (!validateEmail(userData.email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
      toast(newErrors.email, 'error');
    }

    if (!validatePassword(userData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
      hasError = true;
      toast(newErrors.password, 'error');
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    dispatch(registerUser(userData))
      // .then(() => {
      //   toast("Registration successful!", 'success');
      //   setUserData({ username: "", email: "", password: "" });
      //   setErrors({ username: "", email: "", password: "", general: "" });

      //   setTimeout(() => {
      //     navigate("/login"); 
      //   }, 2000);
      //   dispatch(resetAuthStatus());
      // })
      .catch((error) => {
        const errData = error?.response?.data || error?.data;

        if (
          errData &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errData.field;
          const msg = errData.message || "Validation error";

          if (
            field &&
            ["username", "email", "password", "general"].includes(field)
          ) {
            setErrors((prev) => ({ ...prev, [field]: msg }));
            toast(msg, 'error');
          } else {
            setErrors((prev) => ({ ...prev, general: msg }));
            toast(msg, 'error');
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Something went wrong.",
          }));
            toast("Something went wrong.", 'error');
        }
      });
  };

    useEffect(() => {
    if (status === STATUSES.SUCCESS) {
      setTimeout(() => {
        toast("Registration successful! Please check your email to verify your account.", 'success');
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }, 0);
      dispatch(resetAuthStatus());
    } 
  }, [status, navigate, errors, dispatch]);

  return (
      <>
      <AuthForm 
      type="register" 
        onSubmit={handleSubmit}
        onChange={handleChange}
        values={userData}
        setValues={setUserData}
        errors={errors}
        message={toast}
        allChecksPassed={allChecksPassed}
        passwordChecks={passwordChecks}
        passwordStrength={passwordStrength}
        ValidationCheck={ValidationCheck}
      />
      </>

  )
}

export default Register
