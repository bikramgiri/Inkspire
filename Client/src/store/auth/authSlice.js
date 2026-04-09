import { createSlice } from "@reduxjs/toolkit";
import { API, APIAuthenticated } from "../../http";
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
    setProfile: (state, action) => {
      state.user = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = action.payload;
    },
    updateAvatar: (state, action) => {
      state.user = action.payload;  
    },
    deleteUserAvatar: (state) => {
      state.user = {
        ...state.user,
        avatar: null,
      };
    },
    updatePassword: (state, action) => {
      state.user = action.payload;
    },
    emptyForm: (state) => {
      state.user = {
        ...state.user,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    },
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuthStatus, setEmail, setProfile, updateProfile, updateAvatar, deleteUserAvatar, updatePassword, emptyForm } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data) {
      return async function registerUserThunk(dispatch) {
            dispatch(setStatus(STATUSES.LOADING))
            try {
                  const response = await API.post("/api/register", data)
                  if (response.status === 201) {
                        dispatch(setStatus(STATUSES.SUCCESS))
                  }
            } catch (error) {
                  console.error("Registration Error:", error);
                  dispatch(setStatus(STATUSES.ERROR))
                  throw error;
            }
      }
}

export function loginUser(data) {
      return async function loginUserThunk(dispatch) {
            dispatch(setStatus(STATUSES.LOADING))
            try {
                  const response = await API.post("/api/login", data)
                  if (response.status === 200) {
                        dispatch(setUser(response.data.data))
                        localStorage.setItem("user", JSON.stringify(response.data.data))
                        dispatch(setToken(response.data.token))
                        dispatch(setStatus(STATUSES.SUCCESS))
                  }
            } catch (error) {
                  console.log("Login Error:", error)
                  dispatch(setStatus(STATUSES.ERROR))
                  throw error;
            }
      }
}

export function forgotPassword(data) {
      return async function forgotPasswordThunk(dispatch) {
            dispatch(setStatus(STATUSES.LOADING));
            try {
                  const response = await API.post("/api/forgotpassword", data);
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
                  const response = await API.post("/api/verifyotp", data);
                  dispatch(setEmail(data.email));
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
                  const response = await API.post("/api/resetpassword", data);
                  dispatch(setStatus(STATUSES.SUCCESS));
                  return response;
            } catch (error) {
                  dispatch(setStatus(STATUSES.ERROR));
                  throw error;
            }
      };
}

export function fetchProfile() {
  return async function fetchProfileThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get('/global/profile');
      if (response.status === 200) {
        dispatch(setProfile(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log('Failed to fetch profile:', error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function editProfile(payload) {
  return async function editProfileThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch('/global/profile', payload);
      if (response.status === 200) {
        dispatch(updateProfile(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
        dispatch(fetchProfile());
      }
    } catch (error) {
      console.log('Failed to edit profile:', error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// update avatar
export function editAvatar(payload) {
  return async function editAvatarThunk(dispatch) {
      dispatch(setStatus(STATUSES.LOADING));
      try {
          const response = await APIAuthenticated.patch('/global/profile-avatar', payload);
              if (response.status === 200) {
                  dispatch(updateAvatar(response.data.data));
                  dispatch(setStatus(STATUSES.SUCCESS));
                  dispatch(fetchProfile());
              }
      } catch (error) {
              console.log('Failed to update avatar:', error);
                  dispatch(setStatus(STATUSES.ERROR));
                  throw error;
      }
      };
}

// Delete avatar
export function deleteAvatar() {
  return async function deleteAvatarThunk(dispatch) {
      dispatch(setStatus(STATUSES.LOADING));
      try {
          const response = await APIAuthenticated.delete('/global/profile-avatar');
              if (response.status === 200) {
                  dispatch(deleteUserAvatar());
                  dispatch(setStatus(STATUSES.SUCCESS));
                  dispatch(fetchProfile());
              }
      } catch (error) {
              console.log('Failed to update avatar:', error);
                  dispatch(setStatus(STATUSES.ERROR));
                  throw error;
      }
      };
}
export function changePassword(payload) {
  return async function changePasswordThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch('/global/change-password', payload);
      if (response.status === 200) {
        dispatch(updatePassword(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
        dispatch(emptyForm());
      }
    } catch (error) {
      console.log('Failed to change password:', error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}