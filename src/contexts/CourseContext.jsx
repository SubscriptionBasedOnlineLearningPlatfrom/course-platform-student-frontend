import React, { createContext, useState } from "react";
import axios from "axios";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [enrolled, setEnrolled] = useState(false);
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [avgRating,setAvgRating] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [quizMark, setQuizMark] = useState(0);

  const fetchCourseDetails = async (BackendAPI, courseId) => {
    if (!BackendAPI || !courseId) {
      throw new Error("Missing BackendAPI base url or courseId");
    }

    const token = localStorage.getItem("studentToken");

    try {
      const response = await axios.get(`${BackendAPI}/courses/${courseId}` , {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (response.status === 200) {
        setCourse(response.data.course);
        setModules(response.data.modules || []);
        return response.data;
      }

      throw new Error(`Unexpected status code ${response.status}`);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setCourse(null);
      setModules([]);
      throw error;
    }
  };

  const fetchRelatedCourses = async (BackendAPI, category) => {
    try {
      if (!category) return;
      const response = await axios.get(
        `${BackendAPI}/courses/related-courses/${category}`
      );
      if (response.status === 200) {
        setRelatedCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching related courses:", error);
    }
  };

  const fetchDashboardData = async (BackendAPI) => {
    try {
      const response = await axios.get(`${BackendAPI}/dashboard`, {
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        setDashboardData(response.data.dashboard);
        setStreakData(response.data.streak);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchEnrolledCourses = async (BackendAPI) => {
    try {
      const response = await axios.get(
        `${BackendAPI}/dashboard/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setEnrolledCourses(Object.values(response.data.courses));
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const completedCourses = enrolledCourses.filter(
    (c) => Number(c.progress) === 100
  );

  const checkPaymentActive = async (BackendAPI) => {
    const response = await axios.get(`${BackendAPI}/subscription/check`,{
      headers: {
        Authorization : `Bearer ${studentToken}`
      }
    })

    let isActive = false;

    if(response.status === 200){
      isActive =response.data.is_active;
    }
    return isActive;
  }

  const checkEnrollment = async (BackendAPI, courseId) => {
    let isEnrollment = false;
    const response = await axios.get(`${BackendAPI}/courses/check-enrollment/${courseId}`,{
      headers: {
        Authorization : `Bearer ${studentToken}`
      }
    })

    isEnrollment = response.data.isEnrolled;
    return isEnrollment;

  }

  const updateProgressPercentage = async (BackendAPI, courseId) => {
    try {
      const response = await axios.put(`${BackendAPI}/courses/progress-percentage/${courseId}`, {}, {
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });
      console.log("Progress percentage updated:", response.data);
      if (response.status === 200) {
        setProgressPercentage(response.data.progressPercentage);
      }
    } catch (error) {
      console.error("Error updating progress percentage:", error);
    } 
  };

  const getQuizMark = async (BackendAPI, courseId) => {
    try {
      const response = await axios.get(`${BackendAPI}/courses/quiz-marks/${courseId}`, {
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });
      console.log("Quiz mark fetched:", response.data);
      if (response.status === 200) {
        setQuizMark(response.data.total.toFixed(2));
      }
    } catch (error) {
      console.error("Error fetching quiz mark:", error);
    }
  }



  return (
    <CourseContext.Provider
      value={{
        enrolled,
        setEnrolled,
        modules,
        setModules,
        course,
        setCourse,
        relatedCourses,
        setRelatedCourses,
        dashboardData,
        setDashboardData,
        streakData,
        setStreakData,
        avgRating,
        setAvgRating,
        enrolledCourses,
        setEnrolledCourses,
        progressPercentage,
        setProgressPercentage,
        quizMark,
        setQuizMark,
        fetchCourseDetails,
        fetchRelatedCourses,
        fetchDashboardData,
        fetchEnrolledCourses,
        completedCourses,
        checkPaymentActive,
        checkEnrollment,
        updateProgressPercentage,
        getQuizMark
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
