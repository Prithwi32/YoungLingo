'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'

export default function FocusTraining() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [currentExercise, setCurrentExercise] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const levels = ['Letter', 'Word', 'Sentence']
  const questions = [
    'Example text for listening 1',
    'Example text for listening 2',
    'Example text for listening 3',
  ]

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    setCurrentExercise(questions[currentQuestionIndex])
  }

  const handleSubmit = async () => {
    // In a real app, you would compare the user's answer with the correct text
    // For now, we'll simulate a result
    const simulatedResult = Math.floor(Math.random() * 101)
    setResult(simulatedResult)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setCurrentExercise(questions[currentQuestionIndex - 1])
      setResult(null)
      setUserAnswer('')
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentExercise(questions[currentQuestionIndex + 1])
      setResult(null)
      setUserAnswer('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Focus Training</h1>
        {!selectedLevel ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">Choose a level to start:</p>
            <div className="space-x-4 flex justify-center">
              {levels.map((level) => (
                <Button key={level} onClick={() => handleLevelSelect(level)} variant="secondary">
                  {level}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Level: {selectedLevel}</h2>
            <Card className="mb-6">
              <p className="text-xl mb-4 text-center text-gray-800">Listen to the audio and type what you hear:</p>
              <div className="text-center mb-4 ">
                <Button onClick={() => alert('Playing audio...')}>
                  Play Audio
                </Button>
              </div>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type what you hear..."
              ></textarea>
              <div className="text-center mt-4">
                <Button onClick={handleSubmit}>
                  Submit Answer
                </Button>
              </div>
            </Card>
            {result !== null && (
              <Card className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Result:</h3>
                <p className="text-3xl font-bold text-blue-600">{result}%</p>
              </Card>
            )}
            <div className="flex justify-between">
              <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="secondary">
                Previous
              </Button>
              <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} variant="secondary">
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

