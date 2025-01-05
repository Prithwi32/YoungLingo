import Header from './components/Header'
import Button from './components/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-indigo-600">Welcome to LinguaLearn AI</h1>
          <p className="text-xl mb-8 text-gray-700">
            Enhance your language skills with our cutting-edge AI-powered learning platform. 
            We offer personalized lessons to improve your pronunciation and focus your learning efforts.
          </p>
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Key Features:</h2>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center text-gray-600">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                AI-powered pronunciation feedback
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Personalized focus areas based on your performance
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Interactive exercises for rapid improvement
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Progress tracking and performance analytics
              </li>
            </ul>
          </div>
          <Button href="/get-started">Get Started</Button>
        </div>
      </main>
    </div>
  )
}

