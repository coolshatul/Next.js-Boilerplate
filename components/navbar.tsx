'use client'

import Link from 'next/link'
import ThemeToggle from './theme-toggle'

export default function Navbar() {
  return (
    <nav className="bg-gray-100 dark:bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Boilerplate
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}