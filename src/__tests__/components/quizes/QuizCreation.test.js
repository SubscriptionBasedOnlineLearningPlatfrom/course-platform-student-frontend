import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import QuizCreation from "../../../components/quizes/QuizCreation"; // adjust path
import { useApi } from "@/contexts/ApiContext";

// mock axios
jest.mock("axios");

// mock ApiContext
jest.mock("@/contexts/ApiContext", () => ({
  useApi: jest.fn(() => ({ BackendAPI: "http://mock-api" })),
}));

const mockQuizData = {
  full: [
    {
      question: "2 + 2 = ?",
      answers: [
        { answer_text: "3" },
        { answer_text: "4" },
        { answer_text: "5" },
      ],
      correctAnswer: 1,
      point: 1,
    },
    {
      question: "Capital of France?",
      answers: [
        { answer_text: "Berlin" },
        { answer_text: "Madrid" },
        { answer_text: "Paris" },
      ],
      correctAnswer: 2,
      point: 1,
    },
  ],
};

describe("QuizCreation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading initially and then quiz", async () => {
    axios.get.mockResolvedValueOnce({ data: mockQuizData });

    render(
      <BrowserRouter>
        <QuizCreation />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading quiz/i)).toBeInTheDocument();

    const firstQuestion = await screen.findByText(/2 \+ 2 = \?/i);
    expect(firstQuestion).toBeInTheDocument();
  });

  test("shows error message if fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <QuizCreation />
      </BrowserRouter>
    );

    const errorMessage = await screen.findByText(/Error: Network Error/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("selects answers, shows feedback, and finishes quiz", async () => {
    jest.useFakeTimers();
    axios.get.mockResolvedValueOnce({ data: mockQuizData });
    axios.put = jest.fn().mockResolvedValue({ status: 200, data: {} });

    render(
      <BrowserRouter>
        <QuizCreation />
      </BrowserRouter>
    );

    // --- First question
    const firstOption = await screen.findByText("4");
    fireEvent.click(firstOption);

    const nextButton = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextButton);

    // Feedback delay
    jest.advanceTimersByTime(1500);

    // --- Second question
    const secondOption = await screen.findByText("Paris");
    fireEvent.click(secondOption);

    const finishButton = screen.getByRole("button", { name: /Finish Quiz/i });
    fireEvent.click(finishButton);

    jest.advanceTimersByTime(1500);

    // Check that "Quiz Complete!" screen is shown
    await waitFor(() =>
      expect(screen.getByText(/Quiz Complete!/i)).toBeInTheDocument()
    );

    
    expect(
      screen.getByRole("button", { name: /Go to Content Page/i })
    ).toBeInTheDocument();

    jest.useRealTimers();
  });
});
