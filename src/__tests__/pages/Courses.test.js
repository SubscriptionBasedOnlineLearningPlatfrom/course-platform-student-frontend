import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Courses from "../../pages/Courses";
import { useApi } from "../../contexts/ApiContext.jsx";

jest.mock("../../contexts/ApiContext.jsx", () => ({
  useApi: jest.fn(),
}));

const mockCourses = [
  {
    course_id: 1,
    course_title: "React Basics",
    course_description: "Learn React",
    thumbnail_url: "react.jpg",
    level: "Beginner",
    category: "Web",
  },
  {
    course_id: 2,
    course_title: "Advanced JS",
    course_description: "Deep dive into JS",
    thumbnail_url: "js.jpg",
    level: "Beginner", // set to Beginner so it appears in default filter
    category: "Web",
  },
];

describe("Courses Component", () => {
  beforeEach(() => {
    useApi.mockReturnValue({
      getAllCourses: jest.fn().mockResolvedValue(mockCourses),
    });
  });

  test("renders loading and then courses", async () => {
    render(
      <BrowserRouter>
        <Courses />
      </BrowserRouter>
    );

    // check loading
    expect(screen.getByText(/Loading courses/i)).toBeInTheDocument();

    // wait for courses to appear
    await waitFor(() => {
      expect(screen.getByText("React Basics")).toBeInTheDocument();
      expect(screen.getByText("Advanced JS")).toBeInTheDocument();
    });
  });
});
