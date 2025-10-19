'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Article {
  id: string
  title: string
  pdf_url: string
  created_at: string
}

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      const foundArticle = data.articles?.find((a: Article) => a.id === id)
      
      if (foundArticle) {
        setArticle(foundArticle)
      } else {
        setError('Article not found')
      }
    } catch (error) {
      setError('Failed to fetch article')
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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  Academic Archive
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you &apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Archive
          </Link>
        </main>
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
                Browse Papers
              </Link>
              <Link
                href="/submit"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Submit Paper
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Archive
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">Article</li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>Published: {new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <a
                href={article.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View PDF
              </a>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Archive
              </Link>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={article.pdf_url}
                  className="w-full h-96"
                  title="PDF Preview"
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href={article.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Open PDF in new tab →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
