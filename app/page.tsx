'use client'

import { useState } from 'react'

export default function Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setOutput(data.output)
    } catch (error) {
      console.error('Error:', error)
      setOutput('An error occurred while processing your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Next.js Boilerplate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-32 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {output && (
        <div className="mt-6 p-4 border rounded-md dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Output:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  )
}