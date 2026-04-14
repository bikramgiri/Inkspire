import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlice'
import blogReducer from './blog/blogSlice'
import libraryReducer from './library/librarySlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        blog: blogReducer,
        library: libraryReducer,
    },
});

export default store;
