import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../contexts/ApiContext";
import { FaSearch, FaFilter, FaCode, FaPalette, FaBriefcase, FaGlobe, FaBook, FaStar, FaUsers, FaClock } from "react-icons/fa";
import { toast } from "sonner";

const FeaturedCourses = () => {
  const { getAllCourses } = useApi();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Category configurations with icons and colors
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      programming: { icon: FaCode, color: "from-purple-500 to-indigo-600", name: "Programming" },
      design: { icon: FaPalette, color: "from-pink-500 to-rose-600", name: "Design" },
      business: { icon: FaBriefcase, color: "from-green-500 to-emerald-600", name: "Business" },
      language: { icon: FaGlobe, color: "from-blue-500 to-cyan-600", name: "Language" },
    };
    return categoryMap[category?.toLowerCase()] || { icon: FaBook, color: "from-gray-500 to-slate-600", name: category };
  };

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        
        console.log("📚 Fetched courses:", data);
        
        // Map backend data to frontend format
        const mappedCourses = data.map((course) => ({
          id: course.course_id,
          title: course.course_title,
          description: course.course_description || "No description available",
          thumbnail_url: course.thumbnail_url,
          category: course.category || 'general',
          level: course.level || 'Beginner',
          price: course.course_price || 0,
          rating: course.rating || 4.5,
          students: course.enrolled_count || 0,
          duration: course.duration ? `${course.duration} weeks` : "8 weeks",
          instructor: course.instructor_name || "Instructor",
          instructor_id: course.instructor_id,
          created_at: course.created_at,
          updated_at: course.updated_at
        }));

        setCourses(mappedCourses);
        setFilteredCourses(mappedCourses);
        console.log("🔗 Mapped courses with thumbnails:", mappedCourses);
        
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getAllCourses]);

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => 
        course.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => 
        course.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading featured courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading courses: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="language">Language</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-gray-600 mb-6">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-6 py-12">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => {
              const categoryInfo = getCategoryDisplay(course.category);
              const CategoryIcon = categoryInfo.icon;

              return (
                <Link
                  key={course.id}
                  to={`/displayCourses/${course.id}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Course Thumbnail */}
                  <div className="relative overflow-hidden h-48">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback gradient background */}
                    <div 
                      className={`w-full h-full bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center ${course.thumbnail_url ? 'hidden' : 'flex'}`}
                    >
                      <CategoryIcon className="text-white text-4xl" />
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CategoryIcon className="text-xs" />
                        {categoryInfo.name}
                      </span>
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      By {course.instructor}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-700 transition">
                        View Course
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No courses are available at the moment'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCourses;