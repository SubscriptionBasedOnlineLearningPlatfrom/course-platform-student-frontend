import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CourseContext } from "../../contexts/CourseContext";

const CourseModules = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const { modules, setModules } = useContext(CourseContext);

  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      {/* Course Content */}
      <div className="mt-12">
        {/* Modules Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Course Curriculum
          </h2>

          {modules.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No modules available yet</p>
              <p className="text-gray-400 text-sm">
                Course content is being prepared
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.module_id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 text-[#0173d1] rounded-full flex items-center justify-center font-bold mr-4">
                      {module.module_order}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {module.module_title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Module {module.module_order} of {modules.length}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <ChevronRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModules;
