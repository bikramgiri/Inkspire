import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice'
import blogReducer from './blog/blogSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
    },
});

export default store;
