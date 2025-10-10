import React from "react";
import { render, screen, within } from "@testing-library/react";
import Home from "../../pages/Home";
import { MemoryRouter } from "react-router-dom";

describe("Home Component", () => {
  test("renders hero, stats, and featured courses sections", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Use regex to match part of the hero text instead of exact full text
    expect(screen.getByText(/Explore. Learn./i)).toBeInTheDocument();
    expect(screen.getByText(/Grow./i)).toBeInTheDocument();

    expect(screen.getByText(/Courses Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Students/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificates Issued/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Rating/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Choose Our Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to Start Learning/i)).toBeInTheDocument();
  });
});
