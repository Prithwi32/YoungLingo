"use client";

import { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";

export default function GetStarted() {
  const [, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-purple-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-purple-700">
            Get Started with LinguaLearn AI
          </h1>
          <p className="text-xl mb-12 text-center text-gray-700">
            Choose an area you would like to focus on improving:
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700">
                Improve Pronunciation
              </h2>
              <p className="text-gray-700 mb-6">
                Perfect your accent and speech clarity with our AI-powered
                pronunciation trainer.
              </p>
              <Button
                onClick={() => handleOptionSelect("pronunciation")}
                href="/pronunciation"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
              >
                Start Pronunciation Training
              </Button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700">
                Improve Focus
              </h2>
              <p className="text-gray-700 mb-6">
                Enhance your language learning efficiency with our focused
                listening exercises.
              </p>
              <Button
                onClick={() => handleOptionSelect("focus")}
                href="/focus"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
              >
                Start Focus Training
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
