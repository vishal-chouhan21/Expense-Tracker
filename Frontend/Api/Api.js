import axios from "axios";
import { Backend_URL } from "../config";

const Api = axios.create({
  baseURL: Backend_URL,
  headers: {
    "Content-Type": "application/json",

  },
  timeout: 10000,
});

// ====== REQUEST INTERCEPTOR==========
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======== RESPONSE INTERCEPTOR ==============
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // optional redirect
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default Api;
