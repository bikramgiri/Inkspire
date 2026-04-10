import { createSlice } from "@reduxjs/toolkit";
import { API } from "../../http";
import { STATUSES } from "../../global/status";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    status: STATUSES.IDLE,
    token: localStorage.getItem("token") || "",
    email: "",
    resetToken: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logOut: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.status = STATUSES.IDLE;
    },
    resetAuthStatus: (state) => {
      state.status = STATUSES.IDLE;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setResetToken: (state, action) => {
  state.resetToken = action.payload;
},
  },
});

export const {
  setUser,
  setStatus,
  setToken,
  logOut,
  resetAuthStatus,
  setEmail,
  setResetToken,
} = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data) {
  return async function registerUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/api/register", data);
      if (response.status === 201) {
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.error("Registration Error:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function loginUser(data) {
  return async function loginUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/api/login", data);
      if (response.status === 200) {
        dispatch(setUser(response.data.data));
        localStorage.setItem("user", JSON.stringify(response.data.data));
        dispatch(setToken(response.data.token));
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log("Login Error:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function forgotPassword(data) {
  return async function forgotPasswordThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/api/forgot-password", data);
      dispatch(setEmail(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function verifyOTP(data) {
  return async function verifyOTPThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/api/verify-otp", data);
      dispatch(setResetToken(response.data.data)); // Store the reset token in Redux
      dispatch(setStatus(STATUSES.SUCCESS));
      return response;
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function resetPassword(data) {
  return async function resetPasswordThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/api/reset-password", data);
      dispatch(setStatus(STATUSES.SUCCESS));
      return response;
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}
