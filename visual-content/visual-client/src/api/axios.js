import axios from "axios";

// Dynamically resolve base URL to handle both local development and production seamlessly
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Crucial for HTTP-only cookies
});

// Request interceptor to attach JWT token from localStorage if cookie is blocked/not used
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
