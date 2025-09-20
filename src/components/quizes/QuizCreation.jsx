// SimpleQuiz.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const QuizCreation = ({ quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex + 1
    });
  };

  const nextQuestion = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowFeedback(false);
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showResults) {
    const score = quiz.questions.reduce((total, question, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = parseInt(question.correctAnswer);
      return total + (userAnswer === correctAnswer ? parseInt(question.point) : 0);
    }, 0);

    const maxScore = quiz.questions.reduce((total, question) => {
      return total + parseInt(question.point);
    }, 0);

    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 lg:p-12 transform animate-fade-in-up">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="text-6xl lg:text-8xl mb-6 animate-bounce-slow">🏆</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
          </div>
          
          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{percentage}%</div>
                <div className="text-lg uppercase tracking-wider">Score</div>
              </div>
            </div>
          </div>
          
          {/* Score Details */}
          <div className="text-center mb-8 space-y-3">
            <p className="text-lg text-gray-600">
              You scored <span className="font-bold text-blue-500">{score}</span> out of <span className="font-bold text-blue-600">{maxScore}</span> points
            </p>
            <p className="text-lg text-gray-600">
              You answered <span className="font-bold text-green-700">
                {Object.keys(selectedAnswers).filter(key => {
                  const userAnswer = selectedAnswers[key];
                  const correctAnswer = parseInt(quiz.questions[key].correctAnswer);
                  return userAnswer === correctAnswer;
                }).length}
              </span> out of <span className="font-bold text-blue-600">{quiz.questions.length}</span> questions correctly
            </p>
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <button 
              onClick={restartQuiz}
              className="bg-[#0173d1] mb-5 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>🔄</span>
              <span>Take Quiz Again</span>
            </button>
            <button 
              onClick={() => navigate("/courses/2/content")}
              className="bg-[#0173d1] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>🔄</span>
              <span>Go to Content Page</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    const userAnswer = selectedAnswers[currentQuestion];
    const correctAnswer = parseInt(currentQ.correctAnswer);
    const isCorrect = userAnswer === correctAnswer;

    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 lg:p-12 text-center transform animate-scale-in">
          {/* Feedback Icon */}
          <div className={`text-6xl lg:text-8xl mb-6 animate-bounce ${isCorrect ? 'animate-pulse' : ''}`}>
            {isCorrect ? '✅' : '❌'}
          </div>
          
          {/* Feedback Message */}
          <h3 className={`text-2xl lg:text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          
          <p className="text-lg text-gray-600 mb-6">
            {isCorrect ? currentQ.messageForCorrectAnswer : currentQ.messageForIncorrectAnswer}
          </p>
          
          {/* Explanation */}
          {currentQ.explanation && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h4 className="font-bold text-gray-800 mb-2">Explanation:</h4>
              <p className="text-gray-600 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dots-1"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dots-2"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dots-3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 lg:p-10 transform animate-fade-in-up">
        {/* Quiz Header */}
        <div className="text-center border-b-2 border-gray-100 pb-8 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{quiz.quizTitle}</h1>
          
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-[#0173d1] to-[#85c1f3]"
              style={{ 
                width: `${progress}%`,
                backgroundColor: quiz.progressBarColor || '#4CAF50'
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              Q{currentQuestion + 1}
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
          </div>
          
          {currentQ.questionPic && (
            <div className="text-center mb-6">
              <img 
                src={currentQ.questionPic} 
                alt="Question" 
                className="max-w-full h-auto rounded-xl shadow-lg mx-auto max-h-64 object-cover"
              />
            </div>
          )}
        </div>

        {/* Answers Section */}
        <div className="mb-8 space-y-4">
          {currentQ.answers.map((answer, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index + 1;
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
            
            return (
              <div 
                key={index} 
                className={`border-2 rounded-xl p-4 lg:p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white shadow-xl scale-[1.02]' 
                    : 'border-gray-200 bg-gray-50 hover:border-[#0173d1] hover:bg-blue-50'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center space-x-4">
                  {/* Option Letter */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isSelected 
                      ? 'bg-blue bg-opacity-30 text-white' 
                      : 'bg-gray-800 text-white'
                  }`}>
                    {optionLetter}
                  </div>
                  
                  {/* Option Content */}
                  <div className="flex-1">
                    {currentQ.questionType === 'photo' ? (
                      <img 
                        src={answer} 
                        alt={`Option ${optionLetter}`} 
                        className="w-full max-w-xs h-auto rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-lg leading-relaxed">{answer}</span>
                    )}
                  </div>
                  
                  {/* Radio Button */}
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(index)}
                      className="w-5 h-5 text-[#0173d1] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button 
            className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 flex items-center space-x-3 mx-auto ${
              !selectedAnswers[currentQuestion]
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0173d1] to-[#85c1f3] hover:from-[#85c1f3] hover:to-[#0173d1] text-white hover:shadow-xl transform hover:-translate-y-1'
            }`}
            onClick={nextQuestion}
            disabled={!selectedAnswers[currentQuestion]}
          >
            <span>
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </span>
            <span>
              {currentQuestion < quiz.questions.length - 1 ? '→' : '🏁'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};