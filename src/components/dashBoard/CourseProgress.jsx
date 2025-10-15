import React, { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useApi } from "../../contexts/ApiContext";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getProgress, getPlan } = useApi();

  const [courseProgress, setCourseProgress] = useState({
    studentName: "",
    courseTitle: "",
    modules: [],
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, planData] = await Promise.all([
          getProgress(courseId),
          getPlan(),
        ]);
        setCourseProgress(progressData.modules);
        setPlan(planData?.plan);
      } catch (err) {
        console.error("Error fetching progress or plan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, getProgress, getPlan]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-lg font-semibold text-blue-800">
            Loading progress...
          </p>
        </div>
      </div>
    );
  }

  const completedModules = courseProgress.modules.filter(m => m.completed).length;
  const totalModules = courseProgress.modules.length;
  const progressPercent = Math.round((completedModules / totalModules) * 100);

  const pieData = [
    { name: "Completed", value: completedModules },
    { name: "Not Completed", value: totalModules - completedModules },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  const lineData = courseProgress.modules
    .filter(m => m.completed)
    .map((m, index) => ({
      date: m.dateCompleted
        ? new Date(m.dateCompleted).toISOString().split("T")[0]
        : null,
      completedCount: index + 1,
    }));

  const isPro = plan === "Pro";
  const allCompleted = completedModules === totalModules;
  const canDownload = isPro && allCompleted;

  return (
    <div className="p-6 min-h-[calc(100vh-100px)]">
      {/* Info Cards */}
      <div className="flex flex-wrap gap-6 mb-10">
        <div className="flex-1 min-w-[250px] bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Course</h3>
          <h1 className="text-2xl font-bold text-gray-700">
            {courseProgress.courseTitle}
          </h1>
        </div>
        <div className="flex-1 min-w-[250px] bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Student</h3>
          <h1 className="text-2xl font-bold text-gray-700">
            {courseProgress.studentName}
          </h1>
        </div>
        <div className="flex-1 min-w-[250px] bg-white shadow rounded-lg p-6 text-center flex flex-col items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Modules Completed</h3>
            <p className="text-gray-700">
              {completedModules} / {totalModules} ({progressPercent}%)
            </p>
          </div>

          <button
            onClick={() => navigate(`/certificate/${courseId}`)}
            disabled={!canDownload}
            className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition ${
              canDownload
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPro
              ? allCompleted
                ? "Download Certificate"
                : "Complete all modules to unlock certificate"
              : "Upgrade to Pro to get certificate"}
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Pie Chart Card */}
        <div className="flex-1 bg-white shadow rounded-lg p-6 h-[400px] flex justify-center items-center">
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
              cornerRadius={10}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>

        {/* Line Chart Card */}
        <div className="flex-1 bg-white shadow rounded-lg p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completedCount"
                stroke="#82ca9d"
                fill="url(#progressGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#82ca9d" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
