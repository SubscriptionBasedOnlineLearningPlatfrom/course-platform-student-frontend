import React, { use, useContext, useEffect, useState } from "react";
import axios from "axios";
import EnrolledCourses from "../Components/DashBoard/EnrolledCourses";
import { useNavigate } from "react-router-dom";
import { useApi } from "../Contexts/APIContext";
import { CourseContext } from "../Contexts/CourseContext";

const KPI = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl shadow p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const DashBoard = () => {
  // ---- Mock data (replace with API) ----

  const navigate = useNavigate();
  const { BackendAPI } = useApi();
  const {
    dashboardData,
    streakData,
    fetchDashboardData,
    fetchEnrolledCourses,
  } = useContext(CourseContext);

  useEffect(() => {
    (async () => {
      console.log("Fetching dashboard data...");
      await Promise.all([
        fetchDashboardData(BackendAPI),
        fetchEnrolledCourses(BackendAPI),
      ]);
    })();
  }, [BackendAPI]);

  const kpis = [
    {
      label: "Enrolled Courses",
      value: dashboardData ? dashboardData.enrolled_count : 0,
    },
    {
      label: "In Progress",
      value: dashboardData ? dashboardData.in_progress_count : 0,
      sub: "Keep it up!",
    },
    {
      label: "Certificates",
      value: dashboardData ? dashboardData.certificates_count : 0,
    },
    {
      label: "Streak",
      value: streakData ? streakData.streak : 0,
      sub: "Daily goal met",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Greeting / header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
          <p className="text-sm text-gray-600 mt-1">
            Here’s a quick look at your learning progress.
          </p>
        </div>
        <button
          onClick={() => navigate("/courses/2/content")}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Continue Learning
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k) => (
          <KPI key={k.label} {...k} />
        ))}
      </div>

      <div>
        <EnrolledCourses />
      </div>
    </div>
  );
};

export default DashBoard;
