import { render, screen } from "@testing-library/react";
import CourseDetails from "../../../components/courses/CourseDetails";
import { CourseContext } from "../../../contexts/CourseContext";
import { BrowserRouter } from "react-router-dom";

const contextValue = {
  enrolled: false,
  setEnrolled: jest.fn(),
  course: {
    course_id: "1",
    course_title: "React Basics",
    course_description: "Learn React",
    category: "Programming",
    language: "English",
    instructor_name: "John Doe",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  modules: [],
  avgRating: 4.5,
  fetchCourseDetails: jest.fn(),
  fetchRelatedCourses: jest.fn(),
  checkPaymentActive: jest.fn().mockResolvedValue(true),
  checkEnrollment: jest.fn().mockResolvedValue(false),
};

jest.mock("react", () => {
  const ActualReact = jest.requireActual("react");
  return {
    ...ActualReact,
    useState: (initial) => [initial === true ? false : initial, jest.fn()],
  };
});

test("renders enroll button", async () => {
  render(
    <BrowserRouter>
      <CourseContext.Provider value={contextValue}>
        <CourseDetails />
      </CourseContext.Provider>
    </BrowserRouter>
  );

  const enrollButton = await screen.findByText(/Enroll Now/i);
  expect(enrollButton).toBeInTheDocument();
});
