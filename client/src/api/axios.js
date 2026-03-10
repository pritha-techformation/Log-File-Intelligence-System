import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Add request interceptor
API.interceptors.request.use((config) => {
  // Get token from local storage
  const token = localStorage.getItem("token");

  // Add token to request headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Return modified config
  return config;
});

export default API;