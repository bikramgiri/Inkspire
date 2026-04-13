import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../../global/status";
import { APIAuthenticated } from "../../http";

const initialState = {
  blogs: [],
  status: STATUSES.IDLE,
  singleBlog: {},
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSingleBlog: (state, action) => {
      state.singleBlog = action.payload;
    },
    deleteBlogById: (state, action) => {
      state.blogs = state.blogs.filter(
            (blog) => blog._id !== action.payload);
    },
    updateBlogInList: (state, action) => {
      const index = state.blogs.findIndex(
        (blog) => blog._id === action.payload._id,
      );
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    emptyBlogs: (state) => {
      state.blogs = [];
    },
  },
});

export const {
  setBlogs,
  setStatus,
  setSingleBlog,
  deleteBlogById,
  updateBlogInList,
  emptyBlogs,
} = blogSlice.actions;
export default blogSlice.reducer;

export function addBlog(data) {
  return async function addBlogThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.post("/api/blog", data);
      if (response.status === 201) {
        // dispatch(setBlogs(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
        dispatch(fetchBlogs());
      }
    } catch (error) {
      console.log("Failed to add blog:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function fetchBlogs() {
  return async function fetchBlogsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/api/blog");
      if (response.status === 200) {
        dispatch(setBlogs(response.data.data));
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log("Failed to fetch blogs:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// *Fetch Single Blog with API call
// export function fetchSingleBlog(blogId: string){
//       return async function fetchSingleBlogThunk(dispatch: AppDispatch) {
//         dispatch(setStatus(Status.LOADING));
//         try {
//             const response = await API.get(`/api/blog/${blogId}`);
//             dispatch(setSingleBlog(response.data.data));
//             dispatch(setStatus(Status.SUCCESS));
//         } catch (error) {
//             dispatch(setStatus(Status.ERROR));
//             throw error;
//         }
//     }
// }

// *OR

// *Fetch Single product without API call
export function fetchSingleBlog(blogId) {
  return async function fetchSingleBlogThunk(dispatch, getState) {
    const state = getState();
    const blogs = state.blog.blogs;
    const existBlog = blogs.find((blog) => blog._id === blogId);
    if (existBlog) {
      dispatch(setSingleBlog(existBlog));
      dispatch(setStatus(STATUSES.SUCCESS));
    } else {
      dispatch(setStatus(STATUSES.LOADING));
      try {
        const response = await APIAuthenticated.get(`/api/blog/${blogId}`);
        if (response.status === 200) {
          dispatch(setSingleBlog(response.data.data));
          dispatch(setStatus(STATUSES.SUCCESS));
        }
      } catch (error) {
        dispatch(setStatus(STATUSES.ERROR));
        throw error;
      }
    }
  };
}

export function editBlog(payload) {
  return async function editBlogThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/api/blog/${payload.id}`,
        payload.data,
      );
      if (response.status === 200) {
        dispatch(updateBlogInList(response.data.data)); // Update the blog in the list
        dispatch(setSingleBlog(response.data.data)); // Update the single blog view if open
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log("Failed to edit blog:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// *Delete Blog
export function deleteBlog(blogId) {
  return async function deleteBlogThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.delete(`/api/blog/${blogId}`);
      if (response.status === 200) {
        dispatch(deleteBlogById(blogId));
        dispatch(setStatus(STATUSES.SUCCESS));
      }
    } catch (error) {
      console.log("Failed to delete blog:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}
