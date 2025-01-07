'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

type Level = 'BASIC' | 'MEDIUM' | 'HARD';
type Format = 'LETTER' | 'WORD' | 'SENTENCE';

interface Question {
  id: string;
  text: string;
  audioUrl: string;
  difficulty: Level;
  format: Format;
}

interface Answer {
  userInput: string;
  isCorrect: boolean;
  accuracy: number;
}

export default function FocusTraining() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [overallAccuracy, setOverallAccuracy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const levels: Level[] = ['BASIC', 'MEDIUM', 'HARD'];
  const formats: Format[] = ['LETTER', 'WORD', 'SENTENCE'];

  useEffect(() => {
    if (selectedLevel && selectedFormat) {
      generateQuestionsWithAudio(selectedLevel, selectedFormat);
    }
  }, [selectedLevel, selectedFormat]);

  const generateQuestionsWithAudio = async (level: Level, format: Format) => {
    if (!selectedLevel) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generateQuestionsWithAudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, format }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status} and message ${errorData?.error || "Unknown error"}`);
      }

      const data: Question[] = await response.json();
      setQuestions(data);
      setUserAnswers(new Array(data.length).fill({ userInput: '', isCorrect: false, accuracy: 0 }));
      setIsFinished(false);
      setOverallAccuracy(null);
      setCurrentQuestionIndex(0);

    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.message || 'Failed to load questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format);
  };

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = {
      ...newAnswers[currentQuestionIndex],
      userInput: e.target.value,
    };
    setUserAnswers(newAnswers);
  };

  const calculateAccuracy = (userInput: string, correctText: string): number => {
    const userWords = userInput.toLowerCase().split(' ');
    const correctWords = correctText.toLowerCase().split(' ');
    const correctCount = userWords.filter((word, index) => word === correctWords[index]).length;
    return (correctCount / correctWords.length) * 100;
  };

  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userInput = userAnswers[currentQuestionIndex]?.userInput || '';
    const isCorrect = userInput.trim().toLowerCase() === currentQuestion.text.trim().toLowerCase();
    const accuracy = calculateAccuracy(userInput, currentQuestion.text);
  
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = { userInput, isCorrect, accuracy };
  
    setUserAnswers(updatedAnswers);
  
    if (currentQuestionIndex === questions.length - 1) {
      setIsFinished(true);
      const totalAccuracy = updatedAnswers.reduce((acc, ans) => acc + ans.accuracy, 0) / questions.length;
      setOverallAccuracy(totalAccuracy);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  
  const finishQuiz = () => {
    const totalAccuracy = userAnswers.reduce((sum, answer) => sum + answer.accuracy, 0);
    const averageAccuracy = totalAccuracy / questions.length;
    setOverallAccuracy(averageAccuracy);
    setIsFinished(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Focus Training</h1>
        {!selectedLevel ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">Choose a level to start:</p>
            <div className="space-x-4 flex justify-center text-orange-800">
              {levels.map(level => (
                <Button key={level} onClick={() => handleLevelSelect(level)} variant="secondary">
                  {level}
                </Button>
              ))}
            </div>
          </Card>
        ) : !selectedFormat ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">Choose a format to continue:</p>
            <div className="space-x-4 flex justify-center text-orange-800">
              {formats.map(format => (
                <Button key={format} onClick={() => handleFormatSelect(format)} variant="secondary">
                  {format}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">Level: {selectedLevel}</h2>
            {isLoading && <Spinner />}
            {questions.length > 0 && !isFinished && (
              <Card className="mb-6">
                <p className="text-xl mb-4 text-center text-gray-800">
                  Listen to the audio and type what you hear:
                </p>
                <div className="text-center mb-4">
                  <Button onClick={() => handlePlayAudio(questions[currentQuestionIndex].audioUrl)}>
                    Play Audio
                  </Button>
                </div>
                <div className="relative pt-1">
                  <p className="text-center text-gray-500 mb-2">{`Question ${currentQuestionIndex + 1} / ${questions.length}`}</p>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-purple-200">
                    <div
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    ></div>
                  </div>
                </div>
                <textarea
                  className="w-full p-2 border rounded text-gray-500"
                  rows={4}
                  value={userAnswers[currentQuestionIndex]?.userInput || ''}
                  onChange={handleChange}
                  placeholder="Type what you hear..."
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="secondary">
                    Previous
                  </Button>
                  <Button onClick={handleCheckAnswer}>
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </Card>
            )}
            {isFinished && (
              <Card className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Quiz Results:</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">Overall Accuracy: {overallAccuracy?.toFixed(2)}%</p>
                <div className="mt-4">
                  {questions.map((question, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-lg mb-2 text-blue-800">Question {index + 1}:</p>
                      <p className="mb-2 text-purple-800"><strong>Correct Answer:</strong> {question.text}</p>
                      <p className="mb-2 text-gray-800"><strong>Your Answer:</strong> {userAnswers[index].userInput}</p>
                      <p className={userAnswers[index].isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {userAnswers[index].isCorrect ? "Correct" : "Incorrect"}
                      </p>
                      <p className="text-blue-600">
                        Accuracy: {userAnswers[index].accuracy.toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

