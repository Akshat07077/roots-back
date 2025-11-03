'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UploadTest() {
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{success: boolean, message: string, article?: {id: string, title: string, author_name: string, status: string, created_at: string}} | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please select a DOCX file')
        setFile(null)
      }
    }
  }

  const handlePaymentScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (allowedTypes.includes(selectedFile.type)) {
        setPaymentScreenshot(selectedFile)
        setError('')
      } else {
        setError('Payment screenshot must be PNG or JPG')
        setPaymentScreenshot(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !authorName.trim() || !email.trim() || !mobileNumber.trim() || !file) {
      setError('Please provide all required fields')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('authorName', authorName)
      formData.append('email', email)
      formData.append('mobileNumber', mobileNumber)
      formData.append('file', file)
      if (paymentScreenshot) {
        formData.append('paymentScreenshot', paymentScreenshot)
      }

      console.log('🚀 Uploading file:', file.name)
      console.log('📝 Title:', title)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('📥 Response:', data)

      if (response.ok) {
        setResult({
          success: true,
          message: 'File uploaded successfully!',
          article: data.article
        })
        setTitle('')
        setAuthorName('')
        setEmail('')
        setMobileNumber('')
        setFile(null)
        setPaymentScreenshot(null)
        // Reset file inputs
        const fileInput = document.getElementById('file') as HTMLInputElement
        const paymentInput = document.getElementById('paymentScreenshot') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        if (paymentInput) paymentInput.value = ''
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Test Form</h1>
        
        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Upload DOCX File</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Paper Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter paper title"
                required
              />
            </div>

            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                DOCX File *
              </label>
              <input
                type="file"
                id="file"
                accept=".docx"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Only DOCX files are accepted
              </p>
            </div>

            <div>
              <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Screenshot (Optional)
              </label>
              <input
                type="file"
                id="paymentScreenshot"
                accept=".png,.jpg,.jpeg"
                onChange={handlePaymentScreenshotChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG or JPG files only (optional)
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-md">
                ❌ {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-md">
                ✅ {result.message}
                {result.article && (
                  <div className="mt-2 text-sm">
                    <p><strong>Article ID:</strong> {result.article.id}</p>
                    <p><strong>Status:</strong> {result.article.status}</p>
                    <p><strong>Created:</strong> {new Date(result.article.created_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !title.trim() || !authorName.trim() || !email.trim() || !mobileNumber.trim() || !file}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Prepare a DOCX file:</strong>
              <p>Create or find a Word document (.docx) to test with</p>
            </div>
            <div>
              <strong>2. Fill the form:</strong>
              <p>Enter a title and select your DOCX file</p>
            </div>
            <div>
              <strong>3. Upload:</strong>
              <p>Click &quot;Upload File&quot; and watch the console for logs</p>
            </div>
            <div>
              <strong>4. Check results:</strong>
              <p>You should see success message with article ID</p>
            </div>
          </div>
        </div>

        {/* Backend Status */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Backend Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Upload Endpoint:</span>
              <span className="text-green-600">✅ Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-yellow-600">⚠️ Check Supabase setup</span>
            </div>
            <div className="flex justify-between">
              <span>File Conversion:</span>
              <span className="text-yellow-600">⚠️ Will test on upload</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Test Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
