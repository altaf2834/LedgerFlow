import axios from "axios";
import { env } from "../config/env";

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

// Request interceptor: attach JWT to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle expired/invalid token globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
      localStorage.removeItem("accessToken");
      // We're not using useNavigate here since this file is outside React.
      // Simple approach for now — we'll wire this into AuthContext properly
      // once that exists, so it can do a clean redirect instead of a hard reload.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;