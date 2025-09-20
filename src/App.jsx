import React, { useState } from "react";

import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // Import the Toaster
import "./App.css";

import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./components/Footer";
import DisplayCourse from "./pages/DisplayCourse";
import DashBoard from "./pages/DashBoard";
import CourseProgress from "./components/DashBoard/CourseProgress";
import CertificatePage from "./pages/Certificate";
import { QuizComponent } from "./components/quizes/Quiz";
import CourseContentPage from "./components/dashBoard/CourseContentPage";
import Courses from "./pages/Courses";
import Subscription from "./pages/Subscription";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-center" />{" "}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/courses" element={<DisplayCourse />}></Route> --displaycourse is to show a single course when a course from courses is clicked */}
        <Route path="/dashboard" element={<DashBoard />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/courses" element={<Courses />} />{" "}
        {/* this is a page to display all courses which are visible to public users who are not logged in */}
        <Route
          path="/courses/:courseId/progress"
          element={<CourseProgress />}
        />{" "}
        {/* student progress of the logged in student */}
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        <Route path="/displayCourses/:courseId" element={<DisplayCourse />} />
        <Route
          path="/courses/:courseId/content"
          element={<CourseContentPage />}
        />{" "}
        {/* student progress of the logged in student */}
        <Route
          path="/displayCourses/:courseId"
          element={<DisplayCourse />}
        />{" "}
        {/* this is a page to display all courses which are visible to public users who are not logged in */}
        <Route path="/QuizComponent" element={<QuizComponent />} />
        <Route path="/subscription" element={<Subscription />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
