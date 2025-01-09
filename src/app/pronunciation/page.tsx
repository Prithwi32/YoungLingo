"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import ProunciationImage from "../images/pronounciation.png";
import Image from "next/image";

type Level = "BASIC" | "MEDIUM" | "HARD";
type Format = "LETTER" | "WORD" | "SENTENCE";

interface Question {
  text: string;
  difficulty: Level;
  format: Format;
  isCorrect: boolean;
}

interface Answer {
  audioBlob: Blob | null;
  transcript: string;
  accuracy: number | null;
  isCorrect: boolean | null,
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
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const levels: Level[] = ["BASIC", "MEDIUM", "HARD"];
  const formats: Format[] = ["LETTER", "WORD", "SENTENCE"];

  useEffect(() => {
    if (selectedLevel && selectedFormat) {
      generateQuestions(selectedLevel, selectedFormat);
    }
  }, [selectedLevel, selectedFormat]);

  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAnswers((prev) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestionIndex] = {
            ...newAnswers[currentQuestionIndex],
            transcript: transcript,
          };
          return newAnswers;
        });
        compareAnswer(transcript, questions[currentQuestionIndex].text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [currentQuestionIndex, questions]);

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
      setAnswers(
        new Array(10).fill({ audioBlob: null, transcript: "", accuracy: null })
      );
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
        setAnswers(
          new Array(generatedQuestions.length).fill({
            audioBlob: null,
            transcript: "",
            accuracy: null,
          })
        );
      } catch (error) {
        console.error("Error generating questions:", error);
        setError("Failed to generate questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const compareAnswer = async (userAnswer: string, correctAnswer: string) => {
    try {
      const response = await fetch("/api/compareAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer, correctAnswer }),
      });

      if (!response.ok) throw new Error("Failed to compare answer");

      const { accuracy } = await response.json();
      const isCorrect = accuracy === 100

      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = {
          ...newAnswers[currentQuestionIndex],
          accuracy: accuracy,
          isCorrect: isCorrect,
        };
        return newAnswers;
      });
    } catch (error) {
      console.error("Error comparing answer:", error);
      setError("Failed to compare answer. Please try again.");
    }
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentQuestionIndex] = {
              ...newAnswers[currentQuestionIndex],
              audioBlob: event.data,
            };
            return newAnswers;
          });
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNavigation = (direction: "next" | "previous") => {
    setCurrentQuestionIndex((prevIndex) =>
      direction === "next"
        ? Math.min(prevIndex + 1, questions.length - 1)
        : Math.max(prevIndex - 1, 0)
    );
  };

  const handleFinalSubmit = () => {
    setIsCompleted(true);
    const totalAccuracy = answers.reduce(
      (sum, answer) => sum + (answer.accuracy || 0),
      0
    );
    setOverallScore(totalAccuracy / answers.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-purple-100">
      <Header />
      <main className="flex-grow flex items-center justify-center mx-auto px-4 py-8">
        <div className="max-w-6xl w-full flex flex-col md:flex-row mb-6 items-center gap-32">
          {!isCompleted && (
            <div className="md:w-1/2 relative ">
              <Image
                src={ProunciationImage}
                alt="Young person learning languages"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl animate-float mt-10 "
              />
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold mb-10 text-center text-orange-500 md:text-5xl ">
              Pronunciation Training
            </h1>
            {!selectedLevel ? (
              <Card className="text-center max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl ">
                <p className="text-xl mb-4 text-purple-700 p-8">
                  Choose a difficulty level:
                </p>
                <div className="space-x-4 flex justify-center text-orange-800">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      onClick={() => handleLevelSelect(level)}
                      variant="secondary"
                      className="p-5 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </Card>
            ) : !selectedFormat ? (
              <Card className="text-center max-w-md mx-auto">
                <p className="text-xl mb-4 text-purple-700">Choose a format:</p>
                <div className="space-x-4 flex justify-center text-orange-800">
                  {formats.map((format) => (
                    <Button
                      key={format}
                      onClick={() => handleFormatSelect(format)}
                      variant="secondary"
                      className="bg-orange-600 hover:bg-orange-500 text-white font-semibold p-3 rounded-lg transition-colors duration-300"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </Card>
            ) : (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">
                  Level: {selectedLevel} - Format: {selectedFormat}
                </h2>
                {isLoading ? (
                  <Spinner />
                ) : error ? (
                  <Card className="text-center">
                    <p className="text-xl text-red-600">{error}</p>
                    <Button
                      onClick={() =>
                        generateQuestions(selectedLevel, selectedFormat)
                      }
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </Card>
                ) : questions.length > 0 && !isCompleted ? (
                  <div>
                    <Card className="mb-6">
                      <p className="text-xl mb-4 text-center text-gray-800">
                        {questions[currentQuestionIndex]?.text}
                      </p>
                      <div className="text-center mb-4">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </div>
                      {answers[currentQuestionIndex]?.transcript && (
                        <p className="text-center text-gray-600 mt-2">
                          Your answer:{" "}
                          {answers[currentQuestionIndex].transcript}
                        </p>
                      )}
                      {answers[currentQuestionIndex]?.accuracy !== null && (
                        <p className="text-center text-blue-600 mt-2">
                          Accuracy: {answers[currentQuestionIndex].accuracy}%
                        </p>
                      )}
                    </Card>
                    <div className="mb-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            ((currentQuestionIndex + 1) / questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <Button
                        onClick={() => handleNavigation("previous")}
                        disabled={currentQuestionIndex === 0}
                        variant="secondary"
                        className="bg-purple-800 p-3 rounded-full text-white"
                      >
                        Previous
                      </Button>
                      <div className="text-center text-orange-500">
                        <p className="text-lg font-semibold">
                          Progress: {currentQuestionIndex + 1} /{" "}
                          {questions.length}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleNavigation("next")}
                        disabled={currentQuestionIndex === questions.length - 1}
                        variant="secondary"
                        className="bg-purple-800 px-6 py-3 rounded-full text-white"
                      >
                        Next
                      </Button>
                    </div>
                    {currentQuestionIndex === questions.length - 1 &&
                      !isCompleted && (
                        <div className="text-center mt-6">
                          <Button onClick={handleFinalSubmit}>
                            Submit All Answers
                          </Button>
                        </div>
                      )}
                  </div>
                ) : null}
                {isCompleted && (
                  <Card className="text-center mt-6 pl-20 pr-20">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Overall Score:
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600">
                      {overallScore?.toFixed(2)}%
                    </p>
                    <h3 className="text-xl font-semibold mb-2 mt-6 text-gray-800">
                      Results:
                    </h3>
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="mb-4 p-8 bg-gray-50 rounded-lg"
                      >
                        <p className="font-semibold text-gray-800">
                          Question {index + 1}: {question.text}
                        </p>
                        <p className="text-purple-800">
                          Your answer: {answers[index].transcript}
                        </p>
                        <p
                            className={
                              answers[index].isCorrect
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {answers[index].isCorrect
                              ? "Correct"
                              : "Incorrect"}
                          </p>
                        <p className="text-blue-600">
                          Accuracy: {answers[index].accuracy}%
                        </p>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
