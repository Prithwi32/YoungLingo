import Header from './components/Header'
import Button from './components/Button'
import Footer from './components/Footer'
import Image from 'next/image'
import Logo from '../app/images/logo2.png'
import Image1 from '../app/images/AI_Powered_image.png'
import Image2 from '../app/images/focus.png'
import Image3 from '../app/images/interaction.png'
import Image4 from '../app/images/progress_tracting.png'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-purple-50 relative overflow-hidden">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-16 gap-32">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-orange-600 animate-fade-in-down">
                Welcome to YoungLingo
              </h1>
              <p className="text-xl mb-8 text-gray-500 animate-fade-in-up">
                Enhance your language skills with our cutting-edge AI-powered learning platform. 
                We offer personalized lessons to improve your pronunciation and focus your learning efforts.
              </p>
                <div className="flex items-center justify-center ">
                  <Button href="/get-started" className="animate-pulse w-40 ">Get Started</Button>
                 </div>
              </div>
            <div className="md:w-1/2 relative ">
              <Image 
                src={Logo} 
                alt="Young person learning languages" 
                width={400} 
                height={400} 
                className="rounded-lg shadow-2xl animate-float"
              />
            </div>
          </div>
          <div className="space-y-12 mb-16">
            <h2 className="text-3xl font-semibold text-purple-800 text-center animate-fade-in">Key Features:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "AI-powered pronunciation feedback",
                  description: "Get instant feedback on your pronunciation to improve faster.",
                  image: Image1
                },
                {
                  title: "Personalized focus areas",
                  description: "Our AI analyzes your performance to create tailored learning paths.",
                  image: Image2
                },
                {
                  title: "Interactive exercises",
                  description: "Engage with fun, interactive exercises for rapid improvement.",
                  image: Image3
                },
                {
                  title: "Progress tracking",
                  description: "Monitor your progress with detailed performance analytics.",
                  image: Image4
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-center bg-white bg-opacity-50 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105 animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    width={100} 
                    height={100} 
                    className="mr-6 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-orange-600">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-purple-800 mb-8 animate-fade-in">Start Your Language Journey Today</h2>
            <div className="flex items-center justify-center ">
            <Button href="/get-started" className="animate-bounce bg-purple-800 rounded-full">Begin Learning</Button>
            </div>           
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





// import Header from './components/Header'
// import Button from './components/Button'

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <h1 className="text-4xl font-bold mb-6 text-indigo-600">Welcome to LinguaLearn AI</h1>
//           <p className="text-xl mb-8 text-gray-700">
//             Enhance your language skills with our cutting-edge AI-powered learning platform. 
//             We offer personalized lessons to improve your pronunciation and focus your learning efforts.
//           </p>
//           <div className="space-y-6 mb-8">
//             <h2 className="text-2xl font-semibold text-gray-800">Key Features:</h2>
//             <ul className="space-y-2 text-left max-w-md mx-auto">
//               <li className="flex items-center text-gray-600">
//                 <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                 AI-powered pronunciation feedback
//               </li>
//               <li className="flex items-center text-gray-600">
//                 <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                 Personalized focus areas based on your performance
//               </li>
//               <li className="flex items-center text-gray-600">
//                 <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                 Interactive exercises for rapid improvement
//               </li>
//               <li className="flex items-center text-gray-600">
//                 <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                 Progress tracking and performance analytics
//               </li>
//             </ul>
//           </div>
//           <Button href="/get-started">Get Started</Button>
//         </div>
//       </main>
//     </div>
//   )
// }