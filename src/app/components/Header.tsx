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
