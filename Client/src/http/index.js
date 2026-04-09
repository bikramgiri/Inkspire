import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
    baseURL: backendUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

// For Login user
const APIAuthenticated = axios.create({
      baseURL : backendUrl,
      // withCredentials: true, // cookies
      headers: {
            // "Content-Type": "application/json",
            Accept: "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
})

// Request Interceptor: Set Authorization from localStorage dynamically
APIAuthenticated.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers = {
        ...config.headers,
        "Content-Type": undefined,         
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { API, APIAuthenticated };
