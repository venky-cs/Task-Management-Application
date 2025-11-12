import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const instance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default instance;
