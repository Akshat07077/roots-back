'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  docx_url: string
  pdf_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

interface EditorialMember {
  id: string
  name: string
  title: string
  affiliation: string
  email?: string
  phone_number?: string
  photo_url?: string
  bio?: string
}

export default function Admin() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Editorial Board State
  const [showEditorialForm, setShowEditorialForm] = useState(false)
  const [editorialMembers, setEditorialMembers] = useState<EditorialMember[]>([])
  const [submittingEditorial, setSubmittingEditorial] = useState(false)
  const [editorialFormData, setEditorialFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    title: '', // profession
    affiliation: '',
    photo_file: null as File | null,
    photo_url: '',
    bio: ''
  })

  useEffect(() => {
    fetchArticles()
    fetchEditorialMembers()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/approve')
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateArticleStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id)
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()

      if (response.ok) {
        setArticles(articles.map(article => 
          article.id === id 
            ? { ...article, status, updated_at: new Date().toISOString() }
            : article
        ))
      } else {
        alert(data.error || 'Failed to update article')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setUpdating(null)
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

  const getStatusCounts = () => {
    const pending = articles.filter(a => a.status === 'pending').length
    const approved = articles.filter(a => a.status === 'approved').length
    const rejected = articles.filter(a => a.status === 'rejected').length
    return { pending, approved, rejected }
  }

  const statusCounts = getStatusCounts()

  // Editorial Board Functions
  const fetchEditorialMembers = async () => {
    try {
      const response = await fetch('/api/editorial-board')
      const data = await response.json()
      if (response.ok) {
        setEditorialMembers(data.members || [])
      }
    } catch (error) {
      console.error('Failed to fetch editorial members:', error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setEditorialFormData({ ...editorialFormData, photo_file: file })
    }
  }

  const handleEditorialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editorialFormData.name || !editorialFormData.title) {
      alert('Please fill in all required fields: Name and Profession')
      return
    }

    setSubmittingEditorial(true)

    try {
      let photoUrl = editorialFormData.photo_url

      // Upload photo if file is provided
      if (editorialFormData.photo_file) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', editorialFormData.photo_file)

        const uploadResponse = await fetch('/api/editorial-board/upload', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Failed to upload profile picture')
        }

        photoUrl = uploadData.photo_url
      }

      // Submit member data
      const response = await fetch('/api/editorial-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editorialFormData.name,
          phone_number: editorialFormData.phone_number,
          email: editorialFormData.email,
          title: editorialFormData.title, // profession
          affiliation: editorialFormData.affiliation,
          photo_url: photoUrl,
          bio: editorialFormData.bio
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Editorial board member added successfully!')
        setEditorialFormData({
          name: '',
          phone_number: '',
          email: '',
          title: '',
          affiliation: '',
          photo_file: null,
          photo_url: '',
          bio: ''
        })
        setShowEditorialForm(false)
        fetchEditorialMembers()
      } else {
        alert(data.error || 'Failed to add member')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add editorial board member'
      alert(errorMessage)
    } finally {
      setSubmittingEditorial(false)
    }
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
                Browse Papers
              </Link>
              <Link
                href="/submit"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Submit Paper
              </Link>
              <Link
                href="/admin/editorial-board"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">
              Review and manage submitted papers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">{statusCounts.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-900">{statusCounts.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-500">Papers will appear here once they are submitted.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Submissions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <div key={article.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Submitted: {new Date(article.created_at).toLocaleDateString()}</span>
                          {article.updated_at !== article.created_at && (
                            <span>Updated: {new Date(article.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="mt-2 flex space-x-4">
                          <a
                            href={article.docx_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View DOCX
                          </a>
                          <a
                            href={article.docx_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View PDF
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                        {article.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateArticleStatus(article.id, 'approved')}
                              disabled={updating === article.id}
                              className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating === article.id ? 'Updating...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateArticleStatus(article.id, 'rejected')}
                              disabled={updating === article.id}
                              className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updating === article.id ? 'Updating...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editorial Board Management Section */}
          <div className="mt-12">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Editorial Board</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage editorial board members</p>
                </div>
                <button
                  onClick={() => setShowEditorialForm(!showEditorialForm)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                >
                  {showEditorialForm ? 'Cancel' : '+ Add Member'}
                </button>
              </div>

              {/* Add Member Form */}
              {showEditorialForm && (
                <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Add New Editorial Board Member</h4>
                  <form onSubmit={handleEditorialSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={editorialFormData.name}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profession *
                        </label>
                        <input
                          type="text"
                          value={editorialFormData.title}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Professor, Doctor, Researcher"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editorialFormData.phone_number}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, phone_number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editorialFormData.email}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="member@example.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affiliation
                        </label>
                        <input
                          type="text"
                          value={editorialFormData.affiliation}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, affiliation: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., University Name, Institution"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handlePhotoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 5MB. PNG, JPG, JPEG, or WEBP</p>
                        {editorialFormData.photo_file && (
                          <p className="text-sm text-green-600 mt-1">✓ {editorialFormData.photo_file.name} selected</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio (Optional)
                        </label>
                        <textarea
                          value={editorialFormData.bio}
                          onChange={(e) => setEditorialFormData({ ...editorialFormData, bio: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief biography or description..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingEditorial}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingEditorial ? 'Adding...' : 'Add Member'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Members List */}
              <div className="divide-y divide-gray-200">
                {editorialMembers.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No editorial board members yet. Add one using the button above.</p>
                  </div>
                ) : (
                  editorialMembers.map((member) => (
                    <div key={member.id} className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {member.photo_url && (
                          <Image
                            src={member.photo_url}
                            alt={member.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                            unoptimized
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.title}</p>
                          <p className="text-sm text-gray-500">{member.affiliation}</p>
                          <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                            {member.email && <span>📧 {member.email}</span>}
                            {member.phone_number && <span>📞 {member.phone_number}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
