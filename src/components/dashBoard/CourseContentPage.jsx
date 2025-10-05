import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { QuizComponent } from "../quizes/Quiz";

const CourseContentPage = () => {
  const { getCourseContent, updateProgress } = useApi();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  //fetch course content 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourseContent(courseId);
        if (res?.modules) {
          const completed = {};
          res.modules.forEach((mod) => {
            completed[mod.module_id] = mod.is_completed;
          });

          const content = {
            id: courseId,
            name: res.modules[0]?.course_title || "Course",
            modules: res.modules.map((mod) => ({
              id: mod.module_id,
              title: mod.module_title,
              chapters: mod.chapters.map((chap) => ({
                id: chap.lesson_id,
                title: chap.lesson_title,
                resources: [
                  chap.video_url && {
                    id: `${chap.lesson_id}-video`,
                    title: "Video",
                    type: "video",
                    url: chap.video_url,
                  },
                  chap.note_url && {
                    id: `${chap.lesson_id}-note`,
                    title: "Notes",
                    type: "pdf",
                    url: chap.note_url,
                  },
                  chap.assignment_url && {
                    id: `${chap.lesson_id}-assignment`,
                    title: "Assignment",
                    type: "pdf",
                    url: chap.assignment_url,
                  },
                  {
                    id: `${chap.lesson_id}-quiz`,
                    title: "Quiz",
                    type: "quiz",
                  },
                ].filter(Boolean),
              })),
            })),
          };

          setCompletedModules(completed); // set initial checkbox states
          setCourseData(content);
        }
      } catch (err) {
        console.error("Error fetching course content:", err);
      }
    };
    fetchData();
  }, [courseId, getCourseContent]);

  //track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //handle video, pdf, quiz clicks
  const handleResourceClick = (res) => {
    if (res.type === "video") {
      setCurrentVideo(res.url);
    } else if (res.type === "pdf") {
      window.open(res.url, "_blank", "noopener,noreferrer");
    } else if (res.type === "quiz") {
      navigate("/QuizComponent");
    }
  };

  //toggle module completion
  const toggleModuleCompleted = async (moduleId) => {
    const newState = !completedModules[moduleId];

    try {
      await updateProgress(moduleId, newState); // API call
      setCompletedModules((prev) => ({
        ...prev,
        [moduleId]: newState,
      }));
    } catch (err) {
      console.error("Error updating module progress:", err);
    }
  };

  //accordion toggle
  const handleToggleAccordion = (moduleId) => {
    setOpenModule(openModule === moduleId ? null : moduleId);
  };

  //video height based on window size
  const getVideoHeight = () => {
    if (windowWidth >= 2560) return "600px";
    if (windowWidth >= 1440) return "400px";
    if (windowWidth >= 1024) return "350px";
    if (windowWidth >= 768) return "260px";
    return "250px";
  };

  if (!courseData) {
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
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Sidebar header (mobile) */}
      <div className="lg:hidden p-2 bg-white border-b flex justify-between items-center">
        <span className="font-semibold text-blue-800">{courseData.name}</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-800 font-bold text-xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg border-r overflow-y-auto fixed lg:static z-20 top-0 left-0 h-full transition-transform transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-3/4 lg:w-1/4`}
      >
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-blue-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">{courseData.name}</h2>
          <button
            className="lg:hidden text-white font-bold text-lg"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div
          className="p-4 space-y-4"
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          {courseData.modules.map((module) => (
            <div key={module.id} className="border rounded-lg">
              <button
                onClick={() => handleToggleAccordion(module.id)}
                className="flex items-center justify-between w-full p-3 text-left text-blue-800 font-semibold bg-blue-100 rounded-lg hover:bg-blue-200 transition"
              >
                <span>{module.title}</span>
                <input
                  type="checkbox"
                  checked={!!completedModules[module.id]}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleModuleCompleted(module.id);
                  }}
                  className="ml-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </button>

              {openModule === module.id && (
                <div className="pl-5 mt-2 space-y-2 text-black pb-3">
                  {module.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="mb-2">
                      <p className="font-semibold">{chapter.title}</p>
                      <ul className="pl-4 mt-1 space-y-1">
                        {chapter.resources.map((res) => (
                          <li
                            key={res.id}
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => handleResourceClick(res)}
                          >
                            {res.title} ({res.type})
                          </li>
                        ))}
                      </ul>
                      {index !== module.chapters.length - 1 && (
                        <hr className="border-t-2 border-blue-200 my-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <Link
            to={`/courses/${courseId}/progress`}
            className="w-full block text-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            View My Progress
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:flex-1 flex flex-col p-6 lg:ml-1/4">
        <div className="flex-1">
          {currentVideo ? (
            <video
              src={currentVideo}
              controls
              className="w-full rounded-lg shadow-lg border"
              style={{ height: getVideoHeight() }}
            />
          ) : (
            <div
              className="flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg text-black"
              style={{ height: getVideoHeight() }}
            >
              Select a video to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
