import React from "react";
import { render, screen } from "@testing-library/react";
import DashBoard from "../../pages/DashBoard";
import { CourseContext } from "../../Contexts/CourseContext";
import { useNavigate } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock EnrolledCourses 
jest.mock("../../Components/DashBoard/EnrolledCourses", () => () => (
  <div data-testid="mock-enrolled-courses" />
));

describe("DashBoard Component", () => {
  const mockNavigate = jest.fn();

  const mockContextValue = {
    dashboardData: {
      enrolled_count: 3,
      in_progress_count: 2,
      certificates_count: 1,
    },
    streakData: { streak: 5 },
    fetchDashboardData: jest.fn(),
    fetchEnrolledCourses: jest.fn(),
  };

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders dashboard KPIs and greeting", () => {
    render(
      <CourseContext.Provider value={mockContextValue}>
        <DashBoard />
      </CourseContext.Provider>
    );

    // Greeting
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Here’s a quick look at your learning progress/i)
    ).toBeInTheDocument();

    // KPI labels
    expect(screen.getByText(/Enrolled Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificates/i)).toBeInTheDocument();
    expect(screen.getByText(/Streak/i)).toBeInTheDocument();

    // KPI values
    expect(screen.getByText("3")).toBeInTheDocument(); // Enrolled Courses
    expect(screen.getByText("2")).toBeInTheDocument(); // In Progress
    expect(screen.getByText("1")).toBeInTheDocument(); // Certificates
    expect(screen.getByText("5")).toBeInTheDocument(); // Streak

    // Confirm mocked EnrolledCourses renders
    expect(screen.getByTestId("mock-enrolled-courses")).toBeInTheDocument();
  });
});
