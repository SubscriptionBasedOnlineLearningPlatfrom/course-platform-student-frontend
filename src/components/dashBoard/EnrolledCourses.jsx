import React, { useState, useEffect, useContext} from "react";
import CourseCard from "./CourseCard";
import { CourseContext } from "../../contexts/CourseContext";

const EnrolledCourses = () => {
  // Tabs: enrolled or completed
  const [activeTab, setActiveTab] = useState("enrolled");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all"); // For enrolled
  const [selectedCategory, setSelectedCategory] = useState("all"); // For completed
  const {enrolledCourses,completedCourses} = useContext(CourseContext);
  


  // Apply filters and sorting
  useEffect(() => {
    let filtered = [];

    if (activeTab === "enrolled") {
      filtered = enrolledCourses?.filter((course) => {
        const matchesSearch =
          course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "in-progress" &&
            course.progress > 0 &&
            course.progress < 100) ||
          (filterStatus === "not-started" && course.progress === 0) ||
          (filterStatus === "almost-done" && course.progress >= 80);

        return matchesSearch && matchesFilter;
      });

      // Sorting for enrolled
      filtered?.sort((a, b) => {
        switch (sortBy) {
          case "recent":
            return new Date(b.lastAccessed) - new Date(a.lastAccessed);
          case "progress":
            return b.progress - a.progress;
          case "title":
            return a.course_title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    } else {
      filtered = enrolledCourses.filter((course) => {
        const matchesSearch =
          course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          course.category.toLowerCase() === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      // Sorting for completed
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "recent":
            return new Date(b.completion_date) - new Date(a.completion_date);
          case "score":
            return b.score - a.score;
          case "title":
            return a.course_title.localeCompare(b.course_title);
          case "duration":
            return b.duration - a.duration;
          default:
            return 0;
        }
      });
    }

    setFilteredCourses(filtered);
  }, [enrolledCourses, searchTerm, sortBy, filterStatus, selectedCategory, activeTab]);

  // Filter buttons for enrolled courses
  const filterOptions = [
    { key: "all", label: "All Courses", count: enrolledCourses?.length },
    {
      key: "in-progress",
      label: "In Progress",
      count: enrolledCourses?.filter(
        (c) => c.progress > 0 && c.progress < 100
      ).length,
    },
    {
      key: "not-started",
      label: "Not Started",
      count: enrolledCourses?.filter((c) => c.progress === 0).length,
    },
    {
      key: "almost-done",
      label: "Almost Done",
      count: enrolledCourses?.filter((c) => c.progress >= 80).length,
    },
  ];

  const getUniqueCategories = () => {
    
    return  [...new Set(completedCourses.map((c) => c.category))] ;
  };

  const listToShow = activeTab === "enrolled"
  ? (Array.isArray(filteredCourses) ? filteredCourses : [])
  : (Array.isArray(completedCourses) ? completedCourses : []);


  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "enrolled"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("enrolled")}
        >
          Enrolled Courses
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Courses
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {activeTab === "enrolled" ? (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filterStatus === filter.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                All Categories
              </button>
              {getUniqueCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedCategory === category.toLowerCase()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Search and Sort */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-3 py-2 border rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {activeTab === "enrolled" ? (
                <>
                  <option value="recent">Recently Accessed</option>
                  <option value="progress">Progress</option>
                  <option value="title">Title A-Z</option>
                  <option value="duration">Remaining Time</option>
                </>
              ) : (
                <>
                  <option value="recent">Recently Completed</option>
                  <option value="score">Highest Score</option>
                  <option value="title">Title A-Z</option>
                  <option value="duration">Duration</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listToShow.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              type={activeTab}
              onContinue={(course_id) => console.log(`Continue ${course_id}`)}
              onDownloadCertificate={(course_id) =>
                console.log(`Download certificate for ${course_id}`)
              }
              onReviewCourse={(id) => console.log(`Review course ${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <h3 className="text-lg font-medium">
            No {activeTab} courses found
          </h3>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
