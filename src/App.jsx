// App.jsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
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
import { AuthPage } from "./pages/AuthPage";
import BillingSuccess from "./pages/BillingSuccess";

// Layouts
const MainLayout = () => (
  <>
    <Navbar />
    <Toaster richColors position="top-center" />
    <Outlet />
    <Footer />
  </>
);

const AuthLayout = () => (
  <>
    <Toaster richColors position="top-center" />
    <Outlet />
  </>
);

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId/progress" element={<CourseProgress />} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        <Route path="/displayCourses/:courseId" element={<DisplayCourse />} />
        <Route path="/courses/:courseId/content" element={<CourseContentPage />} />
        <Route path="/QuizComponent" element={<QuizComponent />} />
        <Route path="/subscription/:courseId" element={<Subscription />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>
    </Routes>
  );
}

export default App;
