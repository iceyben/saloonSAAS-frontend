// src/lib/adminApi.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function adminApi() {
  return axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export { API };
