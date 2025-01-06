"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";

type Level = "BASIC" | "MEDIUM" | "HARD";
type Format = "LETTER" | "WORD" | "SENTENCE";

interface Question {
  text: string;
  difficulty: Level;
  format: Format;
}

const generateRandomLetters = (length: number) =>
  Array.from({ length }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );

export default function PronunciationTraining() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<number[]>(Array(10).fill(0));
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const levels: Level[] = ["BASIC", "MEDIUM", "HARD"];
  const formats: Format[] = ["LETTER", "WORD", "SENTENCE"];

  useEffect(() => {
    if (selectedLevel && selectedFormat) {
      generateQuestions(selectedLevel, selectedFormat);
    }
  }, [selectedLevel, selectedFormat]);

  const generateQuestions = async (level: Level, format: Format) => {
    setIsLoading(true);
    setError(null);

    if (format === "LETTER") {
      const letters = generateRandomLetters(10).map((text) => ({
        text,
        difficulty: level,
        format,
      }));
      setQuestions(letters);
      setIsLoading(false);
    } else {
      try {
        const response = await fetch("/api/generateQuestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level, format }),
        });

        if (!response.ok) throw new Error("Failed to fetch questions");

        const generatedQuestions = await response.json();
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error("Error generating questions:", error);
        setError("Failed to generate questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format);
  };

  const handleSubmit = () => {
    const simulatedResult = Math.floor(Math.random() * 101);
    setResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[currentQuestionIndex] = simulatedResult;
      return newResults;
    });

    if (currentQuestionIndex === 9) {
      setIsCompleted(true);
    } else {
      handleNavigation("next");
    }
  };

  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentQuestionIndex((prevIndex) =>
      direction === "next"
        ? Math.min(prevIndex + 1, questions.length - 1)
        : Math.max(prevIndex - 1, 0)
    );
  };

  const handleFinalSubmit = () => {
    const totalScore = results.reduce((sum, score) => sum + score, 0);
    setOverallScore(totalScore / 10);
  };

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Pronunciation Training
        </h1>
        {!selectedLevel ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">
              Choose a difficulty level:
            </p>
            <div className="space-x-4 flex justify-center">
              {levels.map((level) => (
                <Button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  variant="secondary"
                >
                  {level}
                </Button>
              ))}
            </div>
          </Card>
        ) : !selectedFormat ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">Choose a format:</p>
            <div className="space-x-4 flex justify-center">
              {formats.map((format) => (
                <Button
                  key={format}
                  onClick={() => handleFormatSelect(format)}
                  variant="secondary"
                >
                  {format}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Level: {selectedLevel} - Format: {selectedFormat}
            </h2>
            {isLoading ? (
              <Card className="text-center">
                <p className="text-xl text-gray-700">Loading questions...</p>
              </Card>
            ) : error ? (
              <Card className="text-center">
                <p className="text-xl text-red-600">{error}</p>
                <Button
                  onClick={() =>
                    generateQuestions(selectedLevel, selectedFormat)
                  }
                  className="mt-4 text-gray-500"
                >
                  Try Again
                </Button>
              </Card>
            ) : questions.length > 0 ? (
              <>
                <Card className="mb-6">
                  <p className="text-xl mb-4 text-center text-gray-800">
                    {questions[currentQuestionIndex]?.text}
                  </p>
                  <div className="text-center mb-4">
                    <Button onClick={handleSubmit}>
                      {isCompleted ? "Retry" : "Start Recording"}
                    </Button>
                  </div>
                </Card>
                {results[currentQuestionIndex] !== 0 && (
                  <Card className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      Result:
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {results[currentQuestionIndex]}%
                    </p>
                  </Card>
                )}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => handleNavigation("previous")}
                    disabled={currentQuestionIndex === 0}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                  <div className="text-center text-orange-500">
                    <p className="text-lg font-semibold">
                      Progress: {currentQuestionIndex + 1} / 10
                    </p>
                  </div>
                  <Button
                    onClick={() => handleNavigation("next")}
                    disabled={currentQuestionIndex === questions.length - 1}
                    variant="secondary"
                  >
                    Next
                  </Button>
                </div>
                {isCompleted && (
                  <div className="text-center mt-6">
                    <Button onClick={handleFinalSubmit}>
                      Submit All Answers
                    </Button>
                  </div>
                )}
                {overallScore !== null && (
                  <Card className="text-center mt-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Overall Score:
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {overallScore.toFixed(2)}%
                    </p>
                  </Card>
                )}
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
