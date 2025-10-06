import React, { createContext, useContext } from "react";
import axios from "axios";

// =======================
// PRIVATE API (with token)
// =======================
const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("studentToken"); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// =======================
// PUBLIC API (no token)
// =======================
const publicApi = axios.create({
  baseURL: "http://localhost:4000",
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// =======================
// API FUNCTIONS
// =======================
const getAllCourses = async () => {
  const response = await publicApi.get("/student/courses");
  return response.data;
};

const getFeaturedCourses = async () => {
  const response = await publicApi.get("/student/courses/featured");
  return response.data;
};

const getCoursesWithRatings = async () => {
  const response = await publicApi.get("/student/courses/with-ratings");
  return response.data;
};

const getCourseContent = async (courseId) => {
  const response = await api.get(`/student/course/${courseId}/content`); 
  return response.data;
};

const startProgressTracking = async (courseId) => {
  const response = await api.post(`/student/course/track-progress`, { courseId });
  return response.data;
};

const updateProgress = async (moduleId, checked) => {
  const response = await api.patch(`/student/course/update-progress`, {
    moduleId,
    isCompleted: checked, 
  });
  return response.data;
};

const getProgress = async (courseId) => {
  const response = await api.get(`/student/course/${courseId}/progress`); 
  return response.data;
};

const getSubmission = async (courseId) => {
  const response = await api.get(`/student/assignments/${courseId}`); 
  return response.data;
};

const addSubmission = async (courseId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/student/assignments/${courseId}/submit`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};


const searchCourses = async (query) => {
  if (!query || query.trim().length < 1) return [];
  const response = await publicApi.get(`/student/courses?search=${encodeURIComponent(query.trim())}`);
  return response.data;
};

// =======================
// CONTEXT
// =======================
const ApiContext = createContext({});

export const ApiProvider = ({ children }) => {
  const BackendAPI = "http://localhost:4000/student";
  const frontendAPI = "http://localhost:5173"

  return (
    <ApiContext.Provider
      value={{
        api,         // private API instance
        publicApi,   // public API instance
        BackendAPI,  // base URL for students
        getAllCourses,
        getFeaturedCourses,
        getCoursesWithRatings,
        getCourseContent,
        startProgressTracking,
        updateProgress,
        getProgress,
        searchCourses,
        getSubmission,
        addSubmission,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Hook for easy access
export const useApi = () => useContext(ApiContext);