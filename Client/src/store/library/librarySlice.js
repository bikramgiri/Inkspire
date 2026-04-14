import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../../global/status";
import { APIAuthenticated } from "../../http";

const initialState = {
  library: [],
  status: STATUSES.IDLE,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setLibrary: (state, action) => {
      state.library = action.payload;
    },
    addToLibrary: (state, action) => {
      state.library.unshift(action.payload);
    },
    removeLibrary: (state, action) => {
      state.library = state.library.filter(
        (library) => library._id !== action.payload,
      );
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setLibrary, addToLibrary, removeLibrary, setStatus } =
  librarySlice.actions;

export default librarySlice.reducer;

// Add to Library
export function AddToLibrary(blogId) {
  return async function addToLibraryThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.post("/api/library", {
        blogId,
      });
      if (response.status === 201) {
        dispatch(addToLibrary(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// Get User Library
export function fetchUserLibrary() {
  return async function fetchUserLibraryThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/api/library");
      dispatch(setLibrary(response.data.data || []));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// Remove from Library
export function removeFromLibrary(blogId) {
  return async function removeLibraryThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.delete(`/api/library/${blogId}`);
      if (response.status === 200) {
        dispatch(setStatus(STATUSES.SUCCESS));
        dispatch(removeLibrary(blogId));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}
