import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

jest.mock("@/pages/Home", () => () => <div>Home Page</div>);
jest.mock("@/pages/Courses", () => () => <div>Courses Page</div>);
jest.mock("@/pages/AuthPage", () => ({ AuthPage: () => <div>Auth Page</div> }));
jest.mock("@/pages/DashBoard", () => () => <div>Dashboard Page</div>);
jest.mock("@/Components/Navbar", () => () => <div>Navbar</div>);
jest.mock("@/Components/Footer", () => () => <footer>Footer Content</footer>);

// Mock logo import
jest.mock("@/assets/logo.jpeg", () => "mocked-logo.jpeg");

jest.mock("@/pages/AuthPage", () => ({
  AuthPage: () => <div>Auth Page</div>,
}));


describe("App Integration", () => {
  // Fixed first test
  test("renders Home page and layout by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Navbar is mocked with text "Navbar"
    expect(screen.getByText("Navbar")).toBeInTheDocument();

    // Footer: query by role or just text in the mock
    const footer = screen.getByRole("contentinfo") || screen.getByText("Footer Content");
    expect(footer).toBeInTheDocument();

    // Home page content
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("renders Courses page when navigating to /courses", () => {
    render(
      <MemoryRouter initialEntries={["/courses"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Courses Page")).toBeInTheDocument();
  });

  test("renders Auth page without Navbar or Footer", () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Auth Page")).toBeInTheDocument();

    // Navbar and Footer should not exist on AuthLayout
    expect(screen.queryByText("Navbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Footer Content")).not.toBeInTheDocument();
  });
});
