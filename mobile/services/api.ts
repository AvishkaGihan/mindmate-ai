import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStore";

/**
 * API Service
 * Configures the global Axios instance for backend communication.
 * Handles authentication injection and global error management.
 */

// Use the environment variable defined in .env
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Injects the JWT Access Token into the Authorization header.
 * Uses the Zustand store's in-memory token for performance.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // We access the store directly via getState() to avoid circular dependency issues
    // during module initialization. The token is read only when a request is actually made.
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global API errors, specifically 401 Unauthorized.
 * Maps Firebase-specific errors to user-friendly messages.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized (Token expired or invalid)
    if (error.response?.status === 401) {
      console.warn("[API] 401 Unauthorized - Logging out");

      // Trigger logout action in the store to clear state and redirect to login
      useAuthStore.getState().logout();
    }

    // Pass the error down to the calling component for specific handling (e.g., showing a toast)
    return Promise.reject(error);
  }
);

export default api;
