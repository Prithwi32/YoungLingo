import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-100">
          LinguaLearn AI
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

