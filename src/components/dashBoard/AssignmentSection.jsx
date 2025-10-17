import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useApi } from "../../contexts/ApiContext";

const AssignmentSection = ({ courseId }) => {
  const { getSubmission, addSubmission } = useApi();
  const [activeTab, setActiveTab] = useState("submit");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await getSubmission(courseId);
        if (res?.submissions) setSubmissions(res.submissions);
      } catch (err) {
        console.error("Error fetching assignment:", err);
      }
    };
    fetchSubmission();
  }, [courseId, getSubmission]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    try {
      await addSubmission(courseId, selectedFile);
      alert("Assignment submitted successfully!");
      setSelectedFile(null);
      
      //refresh submissions after upload
      const res = await getSubmission(courseId);
      if (res?.submissions) setSubmissions(res.submissions);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("Failed to submit assignment");
    }
  };

  return (
    <div className="mt-0 bg-white rounded-2xl shadow-md p-6 border border-gray-200 text-lg">
      {/*tabs*/}
      <div className="flex border-b mb-6 text-xl font-semibold">
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-6 py-3 transition ${
            activeTab === "submit"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Submit Assignment
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-3 transition ${
            activeTab === "view"
              ? "border-b-4 border-blue-600 text-blue-700"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          My Submission
        </button>
      </div>

      {/*submit section*/}
      {activeTab === "submit" && (
        <div className="p-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
          >
            <Upload className="w-10 h-10 text-blue-600 mb-2" />
            <p className="text-lg text-blue-700 font-medium">
              {selectedFile
                ? selectedFile.name
                : "Click to select or drag your file here"}
            </p>
            <p className="text-gray-500 text-base mt-1">
              (Accepted: PDF)
            </p>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Upload & Submit
            </button>
          </div>
        </div>
      )}

      {/*view submission*/}
      {activeTab === "view" && (
        <div className="p-4">
          {submissions.length > 0 ? (
            submissions.map((sub) => {
              //extract file name
              const urlParts = sub.assignment_url.split("/");
              const fullFileName = urlParts[urlParts.length - 1];
              const displayName = fullFileName.includes("-")
                ? fullFileName.split("-").slice(1).join("-")
                : fullFileName;

              return (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200 mb-3"
                >
                  <a
                    href={sub.assignment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium underline text-lg"
                  >
                    {displayName}
                  </a>
                  <span className="text-gray-800 font-semibold text-lg mt-2 sm:mt-0">
                    Grade: {sub.grade ? `${sub.grade}/100` : "Not graded yet"}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-lg">No submission found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
