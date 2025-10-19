'use client'

import { useState } from 'react'

interface Article {
  id: string
  title: string
  docx_url: string
  payment_screenshot_url?: string
  status: string
  created_at: string
}

interface User {
  id: string
  email: string
  mobile_number: string
  author_name: string
  created_at: string
  articles: Article[]
}

export default function UserSubmissions() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')
    setUser(null)

    try {
      const response = await fetch(`/api/user-submissions?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
      } else {
        setError(data.error || 'Failed to fetch user data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Submissions Tracker</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Find User Submissions</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="text-red-800">❌ {error}</div>
          </div>
        )}

        {/* User Information */}
        {user && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg font-semibold text-gray-900">{user.author_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Mobile</label>
                  <p className="text-lg text-gray-900">{user.mobile_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-lg text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Submissions */}
        {user && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Submissions ({user.articles.length})
              </h2>
            </div>
            
            {user.articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No submissions found for this user.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {user.articles.map((article) => (
                  <div key={article.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Submitted: {new Date(article.created_at).toLocaleDateString()}</span>
                          <span>ID: {article.id}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <a
                            href={article.docx_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            📄 Download DOCX
                          </a>
                          {article.payment_screenshot_url && (
                            <a
                              href={article.payment_screenshot_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              💳 View Payment
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Test Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
