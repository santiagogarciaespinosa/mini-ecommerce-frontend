// src/services/api.ts
import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/")
    .replace(/\/+$/, "") + "/";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default api;
