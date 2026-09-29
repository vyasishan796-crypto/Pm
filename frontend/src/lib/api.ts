import axios from "axios";
import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("prakriti_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRoute = error.config?.url?.includes("/api/auth/login") ||
      error.config?.url?.includes("/api/auth/register");

    if (status === 401 && !isAuthRoute && typeof window !== "undefined") {
      const onAuthPage = window.location.pathname.startsWith("/auth/");
      if (!onAuthPage) {
        localStorage.removeItem("prakriti_token");
        localStorage.removeItem("prakriti_user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
