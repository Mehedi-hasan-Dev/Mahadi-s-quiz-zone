"use client";
import React, { useState, useMemo } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import QUIZ_QUESTIONS from "./data/quizQuestions";

// --- HELPER FUNCTION: Shuffles the array and selects the first N questions ---
const shuffleAndSelectQuestions = (questions, count = 20) => {
  // 1. Create a copy of the questions array
  const shuffled = [...questions];

  // 2. Fisher-Yates shuffle algorithm for randomization
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Return the first 'count' questions (e.g., 20)
  return shuffled.slice(0, count);
};
// --------------------------------------------------------------------------

const App = () => {
  // --- Memoization and Caching Logic ---
  const initialQuestions = useMemo(() => {
    if (typeof window !== "undefined") {
      // 1. Check browser's session storage for a previously saved set of 20 questions
      const cachedQuestions = sessionStorage.getItem("quiz_20_questions");

      if (cachedQuestions) {
        // Use the cached questions if they exist (persists across page refresh)
        return JSON.parse(cachedQuestions);
      }
    }

    // 2. If no cache exists, generate a new random set of 20 questions
    const newQuestions = shuffleAndSelectQuestions(QUIZ_QUESTIONS, 20);

    // 3. Save the new questions to session storage for persistence in this session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("quiz_20_questions", JSON.stringify(newQuestions));
    }

    return newQuestions;
  }, []); // Runs only once when the component mounts

  // Use the generated/cached set of 20 questions
  const quizQuestions = initialQuestions;
  const TOTAL_QUESTIONS = quizQuestions.length; // This will always be 20

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  // The current question is now fetched from the 20 question set
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Safety check: if questions haven't loaded yet, prevent rendering logic errors
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <h1 className="text-2xl text-cyan-400 font-mono">
          Loading quiz questions...
        </h1>
      </div>
    );
  }

  const getButtonClass = (option, index) => {
    // Changed rounded-xl to rounded-lg and added font-mono
    let baseClasses =
      "w-full p-4 text-left font-mono font-medium rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl ";

    if (!answered) {
      // Futuristic: Dark button, neon cyan border, light hover
      return (
        baseClasses +
        "bg-gray-800 text-gray-100 border border-cyan-600 hover:bg-cyan-700/30"
      );
    }

    if (option.isCorrect) {
      // Futuristic: Deep Emerald success color
      return (
        baseClasses +
        "bg-emerald-600 text-white shadow-emerald-400/50 scale-[1.01]"
      );
    } else if (index === selectedAnswerIndex && !option.isCorrect) {
      // Futuristic: Deeper Red error color
      return (
        baseClasses +
        "bg-red-700 text-white shadow-red-500/50 ring-2 ring-red-500"
      );
    } else {
      // Futuristic: Faded, dark disabled color
      return (
        baseClasses +
        "bg-gray-900/50 text-gray-500 cursor-not-allowed border border-gray-700"
      );
    }
  };

  const handleAnswerOptionClick = (isCorrect, index) => {
    if (answered) return;

    setSelectedAnswerIndex(index);
    setAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const next = currentQuestionIndex + 1;

      // Check against the total number of randomized questions (20)
      if (next < TOTAL_QUESTIONS) {
        setCurrentQuestionIndex(next);
        setAnswered(false);
        setSelectedAnswerIndex(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  // --- Updated Restart Handler to Clear Cache and Load New Questions ---
  const handleRestartQuiz = () => {
    // 1. Clear the cached questions from session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("quiz_20_questions");
    }

    // 2. Reload the page to force the useMemo logic to generate and cache a NEW random set of 20 questions
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };
  // ---------------------------------------------------------------------

  const scoreText = useMemo(() => {
    const total = TOTAL_QUESTIONS > 0 ? TOTAL_QUESTIONS : 1;
    const percentage = Math.round((score / total) * 100);

    let message = "";
    if (percentage === 100)
      message = "🥳 Perfect Score! You are a trivia master!";
    else if (percentage >= 70)
      message = "👏 Great Job! You have excellent knowledge.";
    else if (percentage >= 40) message = "👍 Good Effort! Keep practicing.";
    else message = "🧠 Time to study up! You got this.";

    return (
      <div className="text-center font-mono">
        <p className="text-5xl font-extrabold text-cyan-400 mb-2 tracking-wider">
          {percentage}%
        </p>
        <p className="text-xl font-semibold text-gray-200 mb-6">{message}</p>
      </div>
    );
  }, [score, TOTAL_QUESTIONS]);

  return (
    // Futuristic: Very dark background
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Futuristic: Dark card, neon cyan border and glow shadow, sharper corners */}
      <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-2xl shadow-cyan-500/30 p-8 md:p-12 border border-cyan-500/70">
        <h1 className="uppercase lg:text-3xl font-extrabold font-mono text-center text-cyan-400 mb-6 tracking-wide">
          MAhadi's GENERAL KNOWLEDGE zone
        </h1>

        {showScore ? (
          <div className="flex flex-col items-center">
            {scoreText}
            {/* Futuristic: White text */}
            <div className="text-xl font-bold text-gray-100 font-mono mb-8">
              You scored {score} out of {TOTAL_QUESTIONS}.
            </div>

            <button
              onClick={handleRestartQuiz}
              // Futuristic: Neon cyan button with glowing shadow
              className="flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg shadow-cyan-500/40 transform hover:scale-[1.02] font-mono"
            >
              <RotateCcw className="w-5 h-5" />
              <span>RESTART SYSTEM</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              {/* Futuristic: Neon cyan text for progress */}
              <div className="text-lg font-bold text-cyan-400 font-mono mb-2">
                Q-{currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
              </div>

              {/* Futuristic: Darker progress bar background */}
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                {/* Futuristic: Neon cyan progress bar fill */}
                <div
                  className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Futuristic: White/light-gray question text */}
            <div className="lg:text-2xl font-semibold text-gray-00 font-mono mb-3  lg:mb-8 min-h-[50px] flex items-center">
              {currentQuestion.questionText}
            </div>

            <div className="space-y-4">
              {currentQuestion.answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswerOptionClick(option.isCorrect, index)
                  }
                  className={getButtonClass(option, index)}
                  disabled={answered}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.answerText}</span>

                    {/* Check/X icons remain white, contrasting with dark/success/error button backgrounds */}
                    {answered &&
                      index === selectedAnswerIndex &&
                      (option.isCorrect ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <X className="w-6 h-6 text-white" />
                      ))}

                    {answered &&
                      index !== selectedAnswerIndex &&
                      option.isCorrect && (
                        <Check className="w-6 h-6 text-white" />
                      )}
                  </div>
                </button>
              ))}
            </div>

            {answered && (
              // Futuristic: Dark info box with cyan border/text
              <div className="mt-6 p-3 text-center rounded-lg bg-gray-800 text-cyan-400 font-medium font-mono border border-cyan-700">
                {currentQuestionIndex + 1 < TOTAL_QUESTIONS
                  ? "[STATUS: PROCESSING NEXT Q]"
                  : "[STATUS: CALCULATING FINAL SCORE]"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
