import { render, screen } from "@testing-library/react";
import Subscription from "@/pages/Subscription";
import { BrowserRouter } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

// Mock the ApiContext
jest.mock("@/contexts/ApiContext", () => ({
  useApi: jest.fn(),
}));

describe("Subscription Component", () => {
  beforeEach(() => {
    // Mock BackendAPI so component renders without errors
    useApi.mockReturnValue({ BackendAPI: "http://mock-api" });
  });

  test("renders plans correctly", () => {
    render(
      <BrowserRouter>
        <Subscription />
      </BrowserRouter>
    );

    // Check if plan names are rendered
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();

    // Check if plan prices are rendered
    expect(screen.getByText("LKR 7000")).toBeInTheDocument();
    expect(screen.getByText("LKR 10000")).toBeInTheDocument();

    // Check if descriptions are rendered
    expect(screen.getByText("Great for trying things out")).toBeInTheDocument();
    expect(screen.getByText("Everything you need to learn fast")).toBeInTheDocument();
  });

  test("renders info blocks", () => {
    render(
      <BrowserRouter>
        <Subscription />
      </BrowserRouter>
    );

    expect(screen.getByText("What’s included?")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Invoices & tax")).toBeInTheDocument();
  });
});
