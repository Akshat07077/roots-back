'use client'

import { useEffect, useState } from 'react'

interface Article {
  id: string
  title: string
  author_name: string
  status: string
  created_at: string
  docx_url?: string
  payment_screenshot_url?: string
}

export default function AdminTest() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      console.log('🔍 Fetching articles for admin...')
      const response = await fetch('/api/admin/approve')
      const data = await response.json()
      setArticles(data.articles || [])
      console.log('✅ Found', data.articles?.length || 0, 'articles')
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error)
      setError('Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const updateArticleStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id)
    try {
      console.log(`🔄 Updating article ${id} to ${status}...`)
      const response = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()
      console.log('📥 Update response:', data)

      if (response.ok) {
        setArticles(articles.map(article => 
          article.id === id 
            ? { ...article, status, updated_at: new Date().toISOString() }
            : article
        ))
        console.log('✅ Article updated successfully')
      } else {
        setError(data.error || 'Failed to update article')
      }
    } catch (error) {
      console.error('❌ Update error:', error)
      setError('Network error. Please try again.')
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Test Dashboard</h1>
        
        {/* Status Overview */}
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
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.filter(a => a.status === 'pending').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.filter(a => a.status === 'approved').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.filter(a => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Articles</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-red-600">
              ❌ {error}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-500 mb-4">Upload some files first to test the admin system.</p>
              <a 
                href="/upload-test" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload Test File
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {articles.map((article) => (
                <div key={article.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Author:</strong> {article.author_name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {article.id}</span>
                        <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                        {article.docx_url && (
                          <a 
                            href={article.docx_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Download DOCX
                          </a>
                        )}
                        {article.payment_screenshot_url && (
                          <a 
                            href={article.payment_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800"
                          >
                            View Payment
                          </a>
                        )}
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
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Test Dashboard
          </a>
          <a 
            href="/upload-test" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Upload Test File →
          </a>
        </div>
      </div>
    </div>
  )
}
