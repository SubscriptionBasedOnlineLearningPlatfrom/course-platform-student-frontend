
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/Home/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Home/ui/card";
import { Badge } from "@/components/Home/ui/badge";
import { Input } from "@/components/Home/ui/input";
import { BookOpen, Users, Award, Star, Search, Play, Clock, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiContext";
import { toast } from "sonner";

// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { getFeaturedCourses, searchCourses } = useApi();

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
    setShowSearchDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Real-time search as user types
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    if (query.trim().length >= 1) {
      setSearchLoading(true);
      try {
        const results = await searchCourses(query);
        setSearchResults(results.slice(0, 8)); // Limit to 8 results
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  // Handle clicking on a search result
  const handleSearchResultClick = (courseId) => {
    navigate(`/displayCourses/${courseId}`);
    setShowSearchDropdown(false);
    setSearchQuery("");
  };

  // Handle clicking outside search to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch featured courses based on real ratings from comments
  useEffect(() => {
    const fetchFeaturedCoursesData = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedCourses();
        
        console.log("🌟 Featured courses with real ratings:", data);
        
        // Map backend data to frontend format
        const mappedCourses = data.map((course) => ({
          id: course.course_id,
          title: course.course_title,
          description: course.course_description || "No description available",
          image: course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
          category: course.category || 'General',
          level: course.level || 'Beginner',
          price: course.course_price ? `$${course.course_price}` : 'Free',
          rating: course.real_rating || course.rating || 4.5, // Use real rating from comments
          students: course.enrolled_count || Math.floor(Math.random() * 10000) + 1000,
          duration: course.duration ? `${course.duration} weeks` : "8 weeks",
          instructor: course.instructor_name || "Expert Instructor",
          commentCount: course.comment_count || 0,
          isRealRating: course.real_rating > 0 // Flag to show if rating is real
        }));

        setFeaturedCourses(mappedCourses);
        
        // Show success message if we have real ratings
        const realRatingsCount = mappedCourses.filter(c => c.isRealRating).length;
        if (realRatingsCount > 0) {
          console.log(`✨ ${realRatingsCount} courses with real ratings from student comments!`);
        }
        
      } catch (error) {
        console.error("Error fetching featured courses:", error);
        toast.error("Failed to load featured courses");
        
        // Fallback to default courses if API fails
        setFeaturedCourses([
          {
            id: "fallback-1",
            title: "Explore Our Courses",
            description: "Browse our complete course catalog",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            level: "All Levels",
            price: "Free",
            rating: 4.5,
            students: 1000,
            duration: "Various",
            instructor: "Expert Instructors",
            commentCount: 0,
            isRealRating: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCoursesData();
  }, [getFeaturedCourses]);

  const stats = [
    { icon: BookOpen, value: "500+", label: "Courses Available" },
    { icon: Users, value: "50k+", label: "Active Students" },
    { icon: Award, value: "25k+", label: "Certificates Issued" },
    { icon: Star, value: "4.8", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Explore. Learn. 

<span className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] bg-clip-text text-transparent"> Grow.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Unlock expert-led courses, keep track of your growth, and earn credentials that showcase your skills. Start advancing your knowledge today.               </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-[#0173d1] rounded-full"
              />
              <Button 
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 transition-all duration-200 ${
                  searchQuery.trim() 
                    ? 'bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Search
              </Button>
              
              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0173d1] mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((course) => (
                        <div
                          key={course.course_id}
                          onClick={() => handleSearchResultClick(course.course_id)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop"}
                              alt={course.course_title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop";
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{course.course_title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{course.course_description}</p>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{course.level}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{course.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No courses found for "{searchQuery}"</p>
                      <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white px-8 py-4 text-lg rounded-full">
                Browse Courses
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-2 border-[#0173d1] text-[#4682b4] hover:bg-blue-50 px-8 py-4 text-lg rounded-full">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Discover our most popular and highly-rated courses</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0173d1]"></div>
              <span className="ml-4 text-lg text-gray-600">Loading featured courses...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="bg-white/90 text-gray-900 hover:bg-white rounded-full"
                        onClick={() => navigate(`/displayCourses/${course.id}`)}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold group-hover:text-[#0173d1] transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <p className="text-gray-600">by {course.instructor}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{course.rating}</span>
                        {course.isRealRating && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {course.commentCount} reviews
                          </span>
                        )}
                        {!course.isRealRating && (
                          <span className="text-gray-500">({course.students.toLocaleString()})</span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#0173d1]">{course.price}</span>
                      <Button 
                        onClick={() => navigate(`/displayCourses/${course.id}`)} 
                        className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1]"
                      >
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All Courses Button */}
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-2 border-[#0173d1] text-[#0173d1] hover:bg-[#0173d1] hover:text-white px-8 py-3">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">Everything you need for successful online learning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-[#0173d1]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert-Led Courses</h3>
              <p className="text-gray-600">Learn from industry professionals and academic experts who bring real-world experience to every lesson.</p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your learning journey with detailed analytics, completion rates, and personalized recommendations.</p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Award className="w-8 h-8 text-[#85c1f3]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Certificates</h3>
              <p className="text-gray-600">Earn industry-recognized certificates upon course completion to showcase your new skills and knowledge.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#0173d1] to-[#85c1f3]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students already advancing their careers</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-[#0173d1] hover:bg-gray-100 px-8 py-4 text-lg rounded-full">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;

      