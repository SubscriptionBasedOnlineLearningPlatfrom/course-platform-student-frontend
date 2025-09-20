
import { useState } from "react";
import { Button } from "@/Components/Home/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/Home/ui/card";
import { Badge } from "@/Components/Home/ui/badge";
import { Input } from "@/Components/Home/ui/input";
import { BookOpen, Users, Award, Star, Search, Play, Clock, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Sarah Wilson",
      rating: 4.8,
      students: 15420,
      duration: "12 weeks",
      level: "Beginner",
      price: "$79/month",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      description: "Master modern web development with React, Node.js, and MongoDB"
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      instructor: "Prof. Michael Chen",
      rating: 4.9,
      students: 8750,
      duration: "16 weeks",
      level: "Intermediate",
      price: "$99/month",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      description: "Learn Python, statistics, and ML algorithms from industry experts"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Jessica Martinez",
      rating: 4.7,
      students: 12300,
      duration: "10 weeks",
      level: "Beginner",
      price: "$69/month",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      description: "Create stunning user interfaces and experiences with Figma and Adobe XD"
    }
  ];

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
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-[#0173d1] rounded-full"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1]">
                Search
              </Button>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="bg-white/90 text-gray-900 hover:bg-white rounded-full">
                      <Play className="w-5 h-5 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold group-hover:text-[#0173d1] transition-colors">
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
                      <span className="text-gray-500">({course.students.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#0173d1]">{course.price}</span>
                    <Button onClick={() => navigate("/displayCourses")} className="bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1]">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      