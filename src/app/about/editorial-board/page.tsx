'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface EditorialMember {
  id: string
  name: string
  title: string
  affiliation: string
  email?: string
  bio?: string
  photo_url?: string
  order_index: number
}

export default function PublicEditorialBoard() {
  const [members, setMembers] = useState<EditorialMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/editorial-board')
      const data = await response.json()
      
      if (response.ok) {
        setMembers(data.members || [])
      } else {
        setError(data.error || 'Failed to fetch editorial board members')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Academic Archive
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
              <Link
                href="/about/editorial-board"
                className="text-blue-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Editorial Board
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Editorial Board</h1>
            <p className="text-gray-600 text-lg">
              Our distinguished editorial board consists of leading experts in their respective fields who oversee the peer review process and maintain the highest standards of academic excellence.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="text-red-800">❌ {error}</div>
            </div>
          )}

          {/* Members Grid */}
          {members.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No editorial board members found</h3>
              <p className="text-gray-500">Please check back later or contact us for more information.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="mx-auto h-24 w-24 rounded-full object-cover mb-4"
                      />
                    ) : (
                      <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    
                    <p className="text-lg text-blue-600 font-medium mb-2">
                      {member.title}
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      {member.affiliation}
                    </p>
                    
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {member.email}
                      </a>
                    )}
                    
                    {member.bio && (
                      <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Interested in Joining Our Editorial Board?
            </h2>
            <p className="text-blue-800 mb-6">
              We're always looking for qualified experts to join our editorial board. If you're interested in contributing to our academic review process, we'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
