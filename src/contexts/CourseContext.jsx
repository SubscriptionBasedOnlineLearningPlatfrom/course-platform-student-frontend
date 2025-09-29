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

  const studentToken = localStorage.getItem("studentToken");

  const fetchCourseDetails = async (BackendAPI, courseId) => {
    const response = await axios.get(`${BackendAPI}/courses/${courseId}`);
    if (response.status === 200) {
      setCourse(response.data.course);
      setModules(response.data.modules || []);
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
    const studentToken = localStorage.getItem('studentToken');
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
    const studentToken = localStorage.getItem('studentToken');
    let isEnrollment = false;
    const response = await axios.get(`${BackendAPI}/courses/check-enrollment/${courseId}`,{
      headers: {
        Authorization : `Bearer ${studentToken}`
      }
    })

    isEnrollment = response.data.isEnrolled;
    return isEnrollment;

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
        enrolledCourses,
        setEnrolledCourses,
        fetchCourseDetails,
        fetchRelatedCourses,
        fetchDashboardData,
        fetchEnrolledCourses,
        completedCourses,
        checkPaymentActive,
        checkEnrollment
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
