import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseModules from "./CourseModules";
import { CourseContext } from "../../contexts/CourseContext";
import { useApi } from "../../contexts/ApiContext";

import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isEnrollment, setIsEnrollment] = useState(false);
  const { enrolled, setEnrolled } = useContext(CourseContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { BackendAPI } = useApi();
  const {
    course,
    setCourse,
    modules,
    setModules,
    fetchCourseDetails,
    fetchRelatedCourses,
    checkPaymentActive,
    checkEnrollment,
  } = useContext(CourseContext);

  // fetch the course when id changes
  useEffect(() => {
    fetchCourseDetails(BackendAPI, courseId);
  }, [BackendAPI, courseId]);

  // fetch related courses when category changes
  useEffect(() => {
    if (!course?.category) return;
    fetchRelatedCourses(BackendAPI, course.category);
  }, [BackendAPI, course?.category]);

  useEffect(() => {
    // Set loading to true initially
    setLoading(true);
    // Simulate API loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchPaymentAndEnrollment = async () => {
      try {
        const paymentActive = await checkPaymentActive(BackendAPI);
        const enrolledStatus = await checkEnrollment(BackendAPI, courseId);

        setIsActive(Boolean(paymentActive));
        setIsEnrollment(Boolean(enrolledStatus));
      } catch (err) {
        console.error("Error checking payment or enrollment:", err);
      }
    };

    fetchPaymentAndEnrollment();
  }, [BackendAPI, courseId]);

  const handleEnrollment = async (courseId) => {
    try {
      const studentToken = localStorage.getItem("studentToken");
      
      const response = await axios.post(
        `${BackendAPI}/courses/enrollment`,
        {course_id:courseId},
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );
      console.log(response)
      if (response.status === 200) {
        navigate(`/courses/${courseId}/content`);
        toast.success("enrollment successfully!");
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Course not found state (This shouldn't happen with dummy data, but keeping for completeness)
  if (!course) {
    return (
      <div className="text-center mt-20">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-500">
          The course you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 md:col-span-2">
            <div className="md:flex">
              {/* Course Image */}
              <div className="md:w-1/3">
                <img
                  src={
                    course.course_image ||
                    "https://images.unsplash.com/photo-1549924231-f129b911e442?fit=crop&w=1000&q=80"
                  }
                  alt={course.course_title || "Course Image"}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Course Info */}
              <div className="md:w-2/3 p-8">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {course.category || "General"}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {course.course_title}
                </h1>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {course.course_description}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {course.language || "English"}
                    </div>
                    <div className="text-sm text-gray-500">Language</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      <span>{course.rating || "0.0"}</span>
                    </div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {course.instructor_image ? (
                        <img
                          src={course.instructor_image}
                          alt={course.instructor_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div>
                          {course.instructor_name?.charAt(0).toUpperCase() ||
                            "I"}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold ">
                        <span className="text-2xl font-bold">
                          {course.instructor_name || "Not Assigned"}
                        </span>
                        <div className="text-sm text-gray-500">Instructor</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Course Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(course.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(course.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modules</span>
                  <span className="text-gray-900 font-medium">
                    {modules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            {isEnrollment ? (
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-2">You're enrolled!</h3>
                <p className="text-green-100 mb-4">
                  Congratulations! You are already part of this course. 🎉
                </p>
                <button
                  onClick={() =>
                    navigate(`/courses/${course.course_id}/content`)
                  }
                  className="w-full bg-white text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Go to Course
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-2">
                  Ready to start learning?
                </h3>
                <p className="text-blue-100 mb-4">
                  Join thousands of students already enrolled in this course.
                </p>
                <button
                  onClick={() => {
                    setEnrolled(true);
                    if (isActive) {
                      handleEnrollment(course.course_id);
                    } else {
                      navigate(`/subscription/${course.course_id}`);
                    }
                  }}
                  className={`w-full bg-white text-[#0173d1] font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    enrolled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>

        <CourseModules />
      </div>
    </div>
  );
};

export default CourseDetails;
