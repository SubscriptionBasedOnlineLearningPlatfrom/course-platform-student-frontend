import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // each course routes to course/:id
import { useApi } from "../Contexts/ApiContext.jsx";
import course1 from "../assets/course1.jpg";

const Courses = () => {
  const { getAllCourses } = useApi(); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState("Beginner");

  const navigate = useNavigate();

  // toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // handle level change
  const handleLevel = (selectedLevel) => {
    setLevel(selectedLevel);
    setIsOpen(false);
  };

  // fetch courses from backend on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();

        // map backend fields to frontend
        const mappedCourses = data.map((course) => ({
          id: course.course_id,
          name: course.course_title,
          description: course.course_description || "No description available",
          image: course.image || course1, // use placeholder if no image
          level: course.level,
        }));

        setCourses(mappedCourses);
      } catch (err) {
        setError(err.message); // backend error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // filter based on search + level
  const filteredCourses = courses.filter(
    (course) =>
      (course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      course.level.toLowerCase() === level.toLowerCase()
  );

  if (loading)
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-xl text-gray-700">Loading courses...</p>
      </div>
    );

  if (error)
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );

  return (
    <div className="px-6 py-10">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6 justify-between">

        {/* Dropdown */}
        <div className="relative sm:w-56">
          <button
            onClick={toggleDropdown}
            className="w-full bg-white border border-gray-300 px-6 py-4 rounded-lg shadow-sm text-gray-800 text-lg font-semibold flex justify-between items-center hover:border-blue-500 hover:shadow-md transition"
          >
            {level} Courses
            <span className="ml-2">▼</span>
          </button>
          {isOpen && (
            <ul className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
              <li
                onClick={() => handleLevel("Beginner")}
                className="px-6 py-4 hover:bg-blue-50 cursor-pointer text-gray-700 text-lg"
              >
                Beginner
              </li>
              <li
                onClick={() => handleLevel("Intermediate")}
                className="px-6 py-4 hover:bg-blue-50 cursor-pointer text-gray-700 text-lg"
              >
                Intermediate
              </li>
              <li
                onClick={() => handleLevel("Advanced")}
                className="px-6 py-4 hover:bg-blue-50 cursor-pointer text-gray-700 text-lg"
              >
                Advanced
              </li>
            </ul>
          )}
        </div>

        {/* Search */}
        <div className="sm:w-80 ml-auto">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-800 px-5 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-lg"
          />
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              to={`/displayCourses/${course.id}`}  ///course/${course.id} -- main part for testing purpose change code 
              key={course.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition duration-300"
            >
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
                  <p className="text-gray-600 mt-2">{course.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xl text-gray-500">No courses found at this level.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
