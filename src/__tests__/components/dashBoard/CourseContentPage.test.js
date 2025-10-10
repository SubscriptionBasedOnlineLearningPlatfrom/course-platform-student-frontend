import { render, screen } from "@testing-library/react";
import CourseContentPage from "../../../components/dashBoard/CourseContentPage";
import { CourseContext } from "@/contexts/CourseContext";
import { BrowserRouter } from "react-router-dom";

// Mock context
const contextValue = {
  updateProgressPercentage: jest.fn(),
};

// Mock useApi inside component
jest.mock("../../../contexts/ApiContext", () => ({
  useApi: () => ({
    getCourseContent: jest.fn().mockResolvedValue({
      modules: [
        {
          module_id: "mod1",
          module_title: "Module 1",
          chapters: [
            { lesson_id: "chap1", lesson_title: "Lesson 1", video_url: "video.mp4" },
          ],
        },
      ],
    }),
    updateProgress: jest.fn(),
    BackendAPI: "mock-api",
  }),
}));

describe("CourseContentPage Component - simple test", () => {
  test("renders View My Progress link", async () => {
    render(
      <BrowserRouter>
        <CourseContext.Provider value={contextValue}>
          <CourseContentPage />
        </CourseContext.Provider>
      </BrowserRouter>
    );

    const progressLink = await screen.findByText(/View My Progress/i);
    expect(progressLink).toBeInTheDocument();
  });
});
