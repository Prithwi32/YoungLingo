'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link'

export default function GetStarted() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Get Started with LinguaLearn AI</h1>
        <p className="text-xl mb-8 text-center text-gray-700">
          Choose an area you'd like to focus on improving:
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Improve Pronunciation</h2>
            <p className="text-gray-700 mb-4">Perfect your accent and speech clarity with our AI-powered pronunciation trainer.</p>
            <Button onClick={() => handleOptionSelect('pronunciation')} href="/pronunciation">
              Start Pronunciation Training
            </Button>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Improve Focus</h2>
            <p className="text-gray-700 mb-4">Enhance your language learning efficiency with our focused listening exercises.</p>
            <Button onClick={() => handleOptionSelect('focus')} href="/focus">
              Start Focus Training
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

