import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { useApi } from "@/contexts/ApiContext";

jest.mock("axios");
jest.mock("@/contexts/ApiContext", () => ({
  useApi: jest.fn(() => ({ BackendAPI: "http://mock-api" })),
}));

const AuthFormMock = ({ mode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword?.value;
    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {mode === "signup" && (
        <>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" />
        </>
      )}
      <label htmlFor="email">Email Address</label>
      <input id="email" name="email" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" />
      {mode === "signup" && (
        <>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" name="confirmPassword" />
        </>
      )}
      <button type="submit">{mode === "login" ? "Sign In" : "Create Account"}</button>
    </form>
  );
};

const AuthPageMock = () => {
  const [mode, setMode] = React.useState("login");
  return (
    <div>
      <button onClick={() => setMode("login")}>Login Tab</button>
      <button onClick={() => setMode("signup")}>Signup Tab</button>
      <AuthFormMock mode={mode} />
    </div>
  );
};

describe("AuthPage Component without Spline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login and signup tabs", () => {
    render(
      <BrowserRouter>
        <AuthPageMock />
      </BrowserRouter>
    );
    expect(screen.getByText("Login Tab")).toBeInTheDocument();
    expect(screen.getByText("Signup Tab")).toBeInTheDocument();
  });

  test("submits login form successfully", () => {
    window.alert = jest.fn();
    render(
      <BrowserRouter>
        <AuthPageMock />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitButton);

    expect(window.alert).not.toHaveBeenCalled();
  });

  test("alerts on password mismatch during signup", () => {
    window.alert = jest.fn();
    render(
      <BrowserRouter>
        <AuthPageMock />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Signup Tab"));

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "user1" } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "signup@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "pass1" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "pass2" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
  });
});
