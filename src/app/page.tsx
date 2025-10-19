'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    testBackend()
  }, [])

  const testBackend = async () => {
    try {
      console.log('🧪 Testing backend connection...')
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data.articles || [])
      console.log('✅ Backend working! Found', data.articles?.length || 0, 'articles')
    } catch (error) {
      console.error('❌ Backend test failed:', error)
      setError('Backend connection failed. Check your Supabase setup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Academic Archive - Backend Test</h1>
        
        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              Testing backend connection...
            </div>
          ) : error ? (
            <div className="text-red-600">
              ❌ {error}
            </div>
          ) : (
            <div className="text-green-600">
              ✅ Backend is working! Found {articles.length} articles
            </div>
          )}
        </div>

        {/* Test Pages */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/upload-test" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Upload Test</h3>
                  <p className="text-sm text-gray-500">Test file upload with form</p>
                </div>
              </div>
            </a>
            
            <a 
              href="/admin-test" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Admin Test</h3>
                  <p className="text-sm text-gray-500">Test approval workflow</p>
                </div>
              </div>
            </a>

            <a 
              href="/user-submissions" 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">User Tracker</h3>
                  <p className="text-sm text-gray-500">Find user submissions</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span><strong>GET</strong> /api/articles</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span><strong>GET</strong> /api/admin/approve</span>
              <span className="text-green-600">✅ Working</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span><strong>POST</strong> /api/upload</span>
              <span className="text-yellow-600">⚠️ Test with upload form</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span><strong>PATCH</strong> /api/admin/approve</span>
              <span className="text-yellow-600">⚠️ Test with admin form</span>
            </div>
          </div>
        </div>

        {/* Quick Test Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Test Instructions</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Test File Upload (Easy Way):</strong>
              <div className="mt-2">
                <a 
                  href="/upload-test" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  📁 Open Upload Form
                </a>
                <p className="text-gray-600 mt-1">Use the web form to upload files directly</p>
              </div>
            </div>
            <div>
              <strong>2. Test File Upload (Command Line):</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
curl -X POST http://localhost:3000/api/upload -F &quot;title=Test Paper&quot; -F &quot;file=@test.docx&quot;
              </pre>
            </div>
            <div>
              <strong>3. Test Admin Endpoints:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
curl http://localhost:3000/api/admin/approve
              </pre>
            </div>
            <div>
              <strong>4. Run Full Test:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
node test-api.js
              </pre>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Approved Articles ({articles.length})</h2>
            <div className="space-y-3">
              {articles.map((article: {id: string, title: string, status: string, created_at: string, docx_url?: string}) => (
                <div key={article.id} className="p-3 border rounded">
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-500">
                    Status: {article.status} | Created: {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  {article.docx_url && (
                    <a href={article.docx_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                      Download DOCX →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}