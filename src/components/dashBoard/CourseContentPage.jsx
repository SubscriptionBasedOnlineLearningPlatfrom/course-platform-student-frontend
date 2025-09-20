import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QuizComponent } from "../quizes/Quiz";

const dummyCourse = {
  id: "react101",
  name: "React for Beginners",
  modules: [
    {
      id: "mod1",
      title: "Module 1: Introduction",
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: Getting Started",
          resources: [
            {
              id: "r1",
              title: "Welcome Video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
            },
            {
              id: "r2",
              title: "Notes PDF",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
            {
              id: "r3",
              title: "Quick Quiz",
              type: "quiz",
            },
          ],
        },
      ],
    },
    {
      id: "mod2",
      title: "Module 2: Basics",
      chapters: [
        {
          id: "ch2",
          title: "Chapter 2: JSX Basics",
          resources: [
            {
              id: "r4",
              title: "JSX Video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
            },
            {
              id: "r5",
              title: "Assignment 1 PDF",
              type: "pdf",
              url: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "mod3",
      title: "Module 3: Next Step",
      chapters: [
        {
          id: "ch3",
          title: "Chapter 3: Deeper JSX",
          resources: [
            {
              id: "r6",
              title: "JSX Explained More",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
            },
            {
              id: "r7",
              title: "Assignment 2 PDF",
              type: "pdf",
              url: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
            },
          ],
        },
      ],
    },
  ],
};

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResourceClick = (res) => {
    if (res.type === "video") {
      setCurrentVideo(res.url);
    } else if (res.type === "pdf") {
      window.open(res.url, "_blank", "noopener,noreferrer");
    } else if (res.type === "quiz") {
      navigate("/QuizComponent");
    }
  };

  const toggleModuleCompleted = (moduleId) => {
    setCompletedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleToggleAccordion = (moduleId) => {
    setOpenModule(openModule === moduleId ? null : moduleId);
  };

  // Determine video height based on screen width
  const getVideoHeight = () => {
    if (windowWidth >= 2560) return "600px";
    if (windowWidth >= 1440) return "400px";
    if (windowWidth >= 1024) return "350px";
    if (windowWidth >= 768) return "260px";
    return "250px";
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Hamburger button for small screens */}
      <div className="lg:hidden p-2 bg-white border-b flex justify-between items-center">
        <span className="font-semibold text-blue-800">{dummyCourse.name}</span>
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
        {/* Course title always visible */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{dummyCourse.name}</h2>
            <p className="text-sm">Course ID: {courseId}</p>
          </div>
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
          {dummyCourse.modules.map((module) => (
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
                  {module.chapters.map((chapter) => (
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
