import axios from "axios";
import { ENV_API_BASE_URL } from "./base-url";

const API = axios.create({
  baseURL: `${ENV_API_BASE_URL}/api`,
  // withCredentials: true,
  // timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access. You may need to log in again.");

      localStorage.removeItem("token");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);
export default API;
