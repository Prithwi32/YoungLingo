'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import Card from '../components/Card'

type Level = 'BASIC' | 'MEDIUM' | 'HARD'
type Format = 'LETTER' | 'SENTENCE'

interface Question {
  text: string
  difficulty: Level
  format: Format
}

export default function PronunciationTraining() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [results, setResults] = useState<number[]>(Array(10).fill(0))
  const [overallScore, setOverallScore] = useState<number | null>(null)

  const levels: Level[] = ['BASIC', 'MEDIUM', 'HARD']
  const formats: Format[] = ['LETTER', 'SENTENCE']

  useEffect(() => {
    if (selectedLevel && selectedFormat) {
      generateQuestions(selectedLevel, selectedFormat)
    }
  }, [selectedLevel, selectedFormat])

  const generateQuestions = (level: Level, format: Format) => {
    // This is where you would integrate with your AI model or API to generate questions
    // For now, we'll use a simple algorithm to generate placeholder questions
    const generatedQuestions: Question[] = Array(10).fill(null).map((_, index) => {
      let text = ''
      if (format === 'LETTER') {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        text = `Pronounce the letter: ${letters[Math.floor(Math.random() * letters.length)]}`
      } else {
        const sentences = [
          "The quick brown fox jumps over the lazy dog.",
          "How vexingly quick daft zebras jump!",
          "Pack my box with five dozen liquor jugs.",
          "The five boxing wizards jump quickly.",
          "Sphinx of black quartz, judge my vow."
        ]
        text = `Say the sentence: ${sentences[Math.floor(Math.random() * sentences.length)]}`
      }
      return {
        text,
        difficulty: level,
        format: format
      }
    })
    setQuestions(generatedQuestions)
  }

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level)
  }

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format)
  }

  const handleSubmit = async () => {
    // In a real app, you would send the audio to your AI model for evaluation
    // For now, we'll simulate a result
    const simulatedResult = Math.floor(Math.random() * 101)
    const newResults = [...results]
    newResults[currentQuestionIndex] = simulatedResult
    setResults(newResults)

    if (currentQuestionIndex === 9) {
      const totalScore = newResults.reduce((sum, score) => sum + score, 0)
      setOverallScore(totalScore / 10)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Pronunciation Training</h1>
        {!selectedLevel ? (
          <Card className="text-center max-w-md mx-auto">
            <p className="text-xl mb-4 text-gray-700">Choose a difficulty level:</p>
            <div className="space-x-4 flex justify-center">
              {levels.map((level) => (
                <Button key={level} onClick={() => handleLevelSelect(level)} variant="secondary">
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
                <Button key={format} onClick={() => handleFormatSelect(format)} variant="secondary">
                  {format}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Level: {selectedLevel} - Format: {selectedFormat}</h2>
            <Card className="mb-6">
              <p className="text-xl mb-4 text-center text-gray-800">{questions[currentQuestionIndex]?.text}</p>
              <div className="text-center mb-4">
                <Button onClick={handleSubmit}>
                  Start Recording
                </Button>
              </div>
            </Card>
            {results[currentQuestionIndex] !== 0 && (
              <Card className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Result:</h3>
                <p className="text-3xl font-bold text-indigo-600">{results[currentQuestionIndex]}%</p>
              </Card>
            )}
            <div className="flex justify-between items-center">
              <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="secondary">
                Previous
              </Button>
              <div className="text-center text-orange-500">
                <p className="text-lg font-semibold">Progress: {currentQuestionIndex + 1} / 10</p>
              </div>
              <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} variant="secondary">
                Next
              </Button>
            </div>
            {overallScore !== null && (
              <Card className="text-center mt-6">
                <h3 className="text-xl font-semibold mb-2">Overall Score:</h3>
                <p className="text-3xl font-bold text-indigo-600">{overallScore.toFixed(2)}%</p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

