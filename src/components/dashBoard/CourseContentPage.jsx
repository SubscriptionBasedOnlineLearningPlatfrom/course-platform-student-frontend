import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../contexts/ApiContext";
import { QuizComponent } from "../quizes/Quiz";
import { CourseContext } from "@/contexts/CourseContext";

const CourseContentPage = () => {
  const { getCourseContent } = useApi();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const {updateProgressPercentage} = useContext(CourseContext);
  const {BackendAPI} = useApi();

  const navigate = useNavigate();

  // update progress percentage
  useEffect(() => {
    updateProgressPercentage(BackendAPI, courseId);
  }, [completedModules]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourseContent(courseId); // API call
        if (res?.modules) {
          // backend response into frontend-friendly format
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
                ].filter(Boolean), // remove nulls
              })),
            })),
          };
          setCourseData(content); // set content from backend to courseData
        }
      } catch (err) {
        console.error("Error fetching course content:", err);
      }
    };
    fetchData();
  }, [courseId, getCourseContent]);

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
        {/* Course title */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{courseData.name}</h2>
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
                      {/* Add horizontal line except after last chapter  */}
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


/* backend sends -
{
    "modules": [
        {
            "module_id": "46ed31a3-e226-4bf8-b9c0-23d206de0426",
            "module_title": "Introduction to React",
            "module_order": 1,
            "course_title": "React",
            "chapters": [
                {
                    "note_url": "https://onlinelearningplatform.sgp1.digitaloceanspaces.com/notes/1758540490470-React_Lesson.pdf",
                    "lesson_id": "565a5fcb-4628-4b39-b207-e15b241ddb29",
                    "video_url": "https://onlinelearningplatform.sgp1.digitaloceanspaces.com/videos/1758540093576-React_Lesson.mp4",
                    "lesson_title": "What is React?",
                    "assignment_url": "https://onlinelearningplatform.sgp1.digitaloceanspaces.com/assignments/1758541470370-AssignmentReactJS.pdf"
                },
                {
                    "note_url": "https://onlinelearningplatform.sgp1.digitaloceanspaces.com/notes/1758817081124-JavaScript.pdf",
                    "lesson_id": "4b697cba-a3df-4249-ac94-a55a6aa36870",
                    "video_url": null,
                    "lesson_title": "Introduction to JavaScript",
                    "assignment_url": null
                },
                {
                    "note_url": null,
                    "lesson_id": "c13a90b2-0cfc-489a-8abe-de87fbb6a94e",
                    "video_url": null,
                    "lesson_title": "Getting Started with React",
                    "assignment_url": null
                },
                {
                    "note_url": null,
                    "lesson_id": "950c15e3-5679-4b2d-b40a-b8d3d6eea77f",
                    "video_url": null,
                    "lesson_title": "React Components",
                    "assignment_url": null
                },
                {
                    "note_url": null,
                    "lesson_id": "d150ecba-f947-4e3b-a57c-c763aa47c77b",
                    "video_url": null,
                    "lesson_title": "JSX Syntax",
                    "assignment_url": null
                },
                {
                    "note_url": null,
                    "lesson_id": "d493f590-6258-4959-9d2f-21f512957164",
                    "video_url": null,
                    "lesson_title": "Props in React",
                    "assignment_url": null
                },
                {
                    "note_url": null,
                    "lesson_id": "172e25e9-71bb-4e3f-b2c7-355cb4881b12",
                    "video_url": null,
                    "lesson_title": "React State",
                    "assignment_url": null
                }
            ]
        }
    ]
}
*/