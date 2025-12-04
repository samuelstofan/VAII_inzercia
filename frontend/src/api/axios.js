import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// pre POST/PUT/DELETE → načítame CSRF cookie
api.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    config.headers["X-XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");
  }
  return config;
});

export default api;
