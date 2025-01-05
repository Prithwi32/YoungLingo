import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LinguaLearn AI',
  description: 'Improve your language skills with our AI-powered app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-indigo-50`}>{children}</body>
    </html>
  )
}

