// Redundant- can be used instead of APIcontext

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

// attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// global response error formatter for api
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Axios instance for public requests (no token)
export const publicApi = axios.create({
  baseURL: "http://localhost:4000",
});

// global response error formatter for publicApi
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// =======================
// COURSES APIs
// =======================

// public endpoint
export const getAllCourses = async () => {
  const response = await publicApi.get("/student/courses");
  return response.data;
};
