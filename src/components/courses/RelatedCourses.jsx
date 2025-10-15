import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { CourseContext } from "../../contexts/CourseContext";
import { FaArrowRight } from "react-icons/fa6";

const RelatedCourses = () => {
  const navigate = useNavigate();
  const { category, relatedCourses } = useContext(CourseContext);

  // Function to format price
  const formatPrice = (price) => {
    return price ? `$${parseFloat(price).toFixed(2)}` : "Free";
  };

  // Function to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          <FaStar />
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="mt-12">
      {/* Section Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            Related Courses
          </h2>
          <button
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            onClick={() => navigate("/courses")}
          >
            View All
            <FaArrowRight />
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCourses.map((course) => (
            <div
              key={course.course_id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail_url?.trim() || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={course.course_title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Course Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.course_title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.course_description}
                  </p>

                  {/* Instructor + Rating in one line */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Instructor */}
                    <div className="flex items-center">
                      {course.instructor_image ? (
                        <img
                          src={course.instructor_image}
                          alt={course.instructor_name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center text-gray-600 font-semibold">
                          {course.instructor_name?.charAt(0).toUpperCase() ||
                            "I"}
                        </div>
                      )}
                      <span className="text-gray-700 text-sm font-medium">
                        {course.instructor_name}
                      </span>
                    </div>

                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    Updated {new Date(course.updated_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      navigate(`/displayCourses/${course.course_id}`)
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    
                    className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/courses")}
            className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Explore More Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedCourses;
