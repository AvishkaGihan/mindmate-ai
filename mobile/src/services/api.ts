import axios from "axios";

// For Android Emulator use 10.0.2.2, for iOS Simulator use localhost
const DEV_API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: DEV_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, //
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
