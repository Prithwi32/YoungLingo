import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-purple-800 text-white py-4 relative z-10 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-100  mt-2  mb-3">
          YoungLingo
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-indigo-200">Home</Link></li>
            <li><Link href="/get-started" className="hover:text-indigo-200">Get Started</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}


// import Link from 'next/link'
// import { useState } from 'react'

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <header className="bg-purple-700 text-white py-4 relative z-20">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold animate-pulse">YoungLingo</Link>
//         <nav className="hidden md:block">
//           <ul className="flex space-x-6">
//             <li><Link href="/" className="hover:text-purple-200 transition-colors">Home</Link></li>
//             <li><Link href="/get-started" className="hover:text-purple-200 transition-colors">Get-Started</Link></li>
//            </ul>
//         </nav>
//         <button 
//           className="md:hidden text-white focus:outline-none"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
//             {isMenuOpen ? (
//               <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
//             ) : (
//               <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
//             )}
//           </svg>
//         </button>
//       </div>
//       {isMenuOpen && (
//         <div className="md:hidden absolute top-full left-0 right-0 bg-purple-700 py-2 px-4 animate-fade-in-down">
//           <ul className="space-y-2">
//             <li><Link href="/" className="block hover:text-purple-200 transition-colors">Home</Link></li>
//             <li><Link href="/get-started" className="block hover:text-purple-200 transition-colors">Get Started</Link></li>
//            </ul>
//         </div>
//       )}
//     </header>
//   )
// }

// import Link from 'next/link'

// export default function Header() {
//   return (
//     <header className="bg-purple-700 text-white py-4 relative z-20">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold animate-pulse">YoungLingo</Link>
//         <nav>
//           <ul className="flex space-x-6">
//             <li><Link href="/" className="hover:text-purple-200 transition-colors">Home</Link></li>
//             <li><Link href="/get-started" className="hover:text-purple-200 transition-colors">Get Started</Link></li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   )
// }

