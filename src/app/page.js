"use client";
import React, { useState, useMemo } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import QUIZ_QUESTIONS from "./data/quizQuestions";

const shuffleAndSelectQuestions = (questions, count = 20) => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};
// --------------------------------------------------------------------------

const NameInputScreen = ({ onStartQuiz }) => {
  const [localName, setLocalName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localName.trim()) {
      onStartQuiz(localName);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-semibold text-gray-200 font-mono mb-8">
        🚀 দেখা যাক আপনি কতটা সাধারণ জ্ঞান জানেন!
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <label
          htmlFor="userName"
          className="block text-lg font-medium text-cyan-400 mb-2 font-mono"
        >
          Enter Your Name:
        </label>
        <input
          type="text"
          id="userName"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="Your Full Name"
          required
          className="w-full p-4 mb-6 text-xl text-gray-100 bg-gray-800 border border-cyan-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500 font-mono"
        />

        <button
          type="submit"
          disabled={!localName.trim()}
          className="w-full flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg shadow-cyan-500/40 transform hover:scale-[1.02] disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed font-mono"
        >
          <Check className="w-5 h-5" />
          <span>START QUIZ</span>
        </button>
      </form>
    </div>
  );
};
// ------------------------------------------------------------------

const App = () => {
  const initialQuestions = useMemo(() => {
    if (typeof window !== "undefined") {
      const cachedQuestions = sessionStorage.getItem("quiz_20_questions");

      if (cachedQuestions) {
        return JSON.parse(cachedQuestions);
      }
    }

    const newQuestions = shuffleAndSelectQuestions(QUIZ_QUESTIONS, 20);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("quiz_20_questions", JSON.stringify(newQuestions));
    }

    return newQuestions;
  }, []);

  const quizQuestions = initialQuestions;
  const TOTAL_QUESTIONS = quizQuestions.length;

  const [userName, setUserName] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

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
    let baseClasses =
      "w-full p-4 text-left font-mono font-medium rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl ";

    if (!answered) {
      return (
        baseClasses +
        "bg-gray-800 text-gray-100 border border-cyan-600 hover:bg-cyan-700/30"
      );
    }

    if (option.isCorrect) {
      return (
        baseClasses +
        "bg-emerald-600 text-white shadow-emerald-400/50 scale-[1.01]"
      );
    } else if (index === selectedAnswerIndex && !option.isCorrect) {
      return (
        baseClasses +
        "bg-red-700 text-white shadow-red-500/50 ring-2 ring-red-500"
      );
    } else {
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

      if (next < TOTAL_QUESTIONS) {
        setCurrentQuestionIndex(next);
        setAnswered(false);
        setSelectedAnswerIndex(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const handleRestartQuiz = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("quiz_20_questions");
    }

    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleStartQuiz = (name) => {
    setUserName(name.trim());
    setQuizStarted(true);
  };
  // ------------------------------------------------------------

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-2xl shadow-cyan-500/30 p-8 md:p-12 border border-cyan-500/70">
        <h1 className="uppercase lg:text-3xl font-extrabold font-mono text-center text-cyan-400 mb-6 tracking-wide">
          মাহাদীর চুদুর-বুদূর জোন
        </h1>

        {!quizStarted ? (
          <NameInputScreen onStartQuiz={handleStartQuiz} />
        ) : showScore ? (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-white font-mono mb-4">
              {userName.toUpperCase()}'S RESULTS
            </h2>

            {scoreText}

            <div className="text-xl font-bold text-gray-100 font-mono mb-8">
              তুমি {score} পাইছো {TOTAL_QUESTIONS} এর মধ্যে.
            </div>

            <button
              onClick={handleRestartQuiz}
              className="flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg shadow-cyan-500/40 transform hover:scale-[1.02] font-mono"
            >
              <RotateCcw className="w-5 h-5" />
              <span>RESTART SYSTEM</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-lg font-bold text-cyan-400 font-mono mb-2">
                Q-{currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2.5">
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

            <div className="lg:text-2xl font-semibold text-gray-100 font-mono mb-3  lg:mb-8 min-h-[50px] flex items-center">
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
