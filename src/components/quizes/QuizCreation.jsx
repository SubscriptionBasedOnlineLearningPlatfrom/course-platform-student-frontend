// SimpleQuiz.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

export const QuizCreation = () => {
  const [rawQuiz, setRawQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNextQuestion, setShowNextQuestion] = useState(false);

  const navigate = useNavigate();
  const { BackendAPI } = useApi();

  // Fetch quiz from backend when no prop
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this ID with whatever you need or pass as prop
        const quizId = "f1dcb0c9-17de-4fe8-8ccf-c5e973faa444";
        const response = await axios.get(`${BackendAPI}/quizzes/${quizId}`);
        const data = response.data;

        setRawQuiz(data);

        if (!data.length) {
          throw new Error("Quiz data is missing or malformed");
        }
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [BackendAPI]);

  
  // Guard UI while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quiz…
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No quiz available
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // --- Answer selection
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }));
  };

  // --- Move to next question (with feedback)
  const nextQuestion = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswers((prev) => ({ ...prev })); // no-op but keeps state stable
      setCurrentQuestion((prev) => {
        const next = prev + 1;
        if (next < questions.length) return next;
        // finished
        setShowResults(true);
        return prev;
      });
    }, 1500);
  };

  // --- Results UI
  if (showResults) {
    // score uses Number conversion because correctAnswer/point might be strings
    const score = questions.reduce((total, question, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = Number(question.correctAnswer);
      const point = Number(question.point ?? 1);
      return total + (userAnswer === correctAnswer ? point : 0);
    }, 0);

    const maxScore = questions.reduce((total, question) => {
      return total + Number(question.point ?? 1);
    }, 0);

    const percentage = Math.round((score / Math.max(1, maxScore)) * 100);

    const correctCount = questions.filter((q, index) => {
      const userAnswer = selectedAnswers[index];
      return userAnswer === Number(q.correctAnswer);
    }).length;

    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 lg:p-12 transform animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="text-6xl lg:text-8xl mb-6 animate-bounce-slow">
              🏆
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Quiz Complete!
            </h2>
          </div>
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-[#0173d1] to-[#85c1f3] flex items-center justify-center shadow-xl">
              <div className="text-center text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {percentage}%
                </div>
                <div className="text-lg uppercase tracking-wider">Score</div>
              </div>
            </div>
          </div>
          <div className="text-center mb-8 space-y-3">
            <p className="text-lg text-gray-600">
              You scored{" "}
              <span className="font-bold text-blue-500">{score}</span> out of{" "}
              <span className="font-bold text-blue-600">{maxScore}</span> points
            </p>
            <p className="text-lg text-gray-600">
              You answered{" "}
              <span className="font-bold text-green-700">{correctCount}</span>{" "}
              out of{" "}
              <span className="font-bold text-blue-600">
                {questions.length}
              </span>{" "}
              questions correctly
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/courses/2/content")}
              className="bg-[#0173d1] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
            >
              → Go to Content Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Feedback UI
  if (showFeedback) {
    const userAnswer = selectedAnswers[currentQuestion];
    const correctAnswer = Number(currentQ.correctAnswer);
    const isCorrect = userAnswer === correctAnswer;

    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 lg:p-12 text-center transform animate-scale-in">
          <div
            className={`text-6xl lg:text-8xl mb-6 animate-bounce ${
              isCorrect ? "animate-pulse" : ""
            }`}
          >
            {isCorrect ? "✅" : "❌"}
          </div>
          <h3
            className={`text-2xl lg:text-3xl font-bold mb-4 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            {isCorrect
              ? currentQ.messageForCorrectAnswer || "Good job! 🎉"
              : `The correct answer is: ${currentQ.answers[correctAnswer]}`}
          </p>
          <p className="text-lg text-gray-600 mb-6">
            {isCorrect
              ? currentQ.messageForCorrectAnswer
              : currentQ.messageForIncorrectAnswer}
          </p>
        </div>
        <div>
          <button>Go to next Question</button>
        </div>
      </div>
    );
  }

  // --- Question UI
  
    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 lg:p-10 transform animate-fade-in-up">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-[#0173d1] to-[#85c1f3]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                Q{currentQuestion + 1}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="mb-8 space-y-4">
            {(currentQ.answers || []).map((answer, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const optionLetter = String.fromCharCode(65 + index);

              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-4 lg:p-6 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white shadow-xl scale-[1.02]"
                      : "border-gray-200 bg-gray-50 hover:border-[#0173d1] hover:bg-blue-50"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? "bg-blue bg-opacity-30 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <div className="flex-1 text-lg leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="text-center">
            <button
              className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 ${
                selectedAnswers[currentQuestion] === undefined
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white hover:shadow-xl transform hover:-translate-y-1"
              }`}
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion < questions.length - 1
                ? "Next Question →"
                : "Finish Quiz 🏁"}
            </button>
          </div>
        </div>
      </div>
    );
  }


export default QuizCreation;
