'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface EditorialMember {
  id: string
  name: string
  title: string
  affiliation: string
  email?: string
  bio?: string
  photo_url?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export default function EditorialBoard() {
  const [members, setMembers] = useState<EditorialMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    affiliation: '',
    email: '',
    bio: '',
    photo_url: '',
    order_index: 0
  })

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
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.title || !formData.affiliation) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/editorial-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMembers([...members, data.member])
        setFormData({
          name: '',
          title: '',
          affiliation: '',
          email: '',
          bio: '',
          photo_url: '',
          order_index: 0
        })
        setShowAddForm(false)
        alert('Editorial board member added successfully!')
      } else {
        alert(data.error || 'Failed to add member')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingMember || !formData.name || !formData.title || !formData.affiliation) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/editorial-board', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingMember.id,
          ...formData
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMembers(members.map(member => 
          member.id === editingMember.id ? data.member : member
        ))
        setEditingMember(null)
        setFormData({
          name: '',
          title: '',
          affiliation: '',
          email: '',
          bio: '',
          photo_url: '',
          order_index: 0
        })
        alert('Editorial board member updated successfully!')
      } else {
        alert(data.error || 'Failed to update member')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this editorial board member?')) {
      return
    }

    try {
      const response = await fetch(`/api/editorial-board?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setMembers(members.filter(member => member.id !== id))
        alert('Editorial board member deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete member')
      }
    } catch {
      alert('Network error. Please try again.')
    }
  }

  const startEdit = (member: EditorialMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      title: member.title,
      affiliation: member.affiliation,
      email: member.email || '',
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      order_index: member.order_index
    })
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingMember(null)
    setShowAddForm(false)
    setFormData({
      name: '',
      title: '',
      affiliation: '',
      email: '',
      bio: '',
      photo_url: '',
      order_index: 0
    })
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
                href="/admin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
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
            <p className="text-gray-600">
              Meet our distinguished editorial board members who oversee the academic review process.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="text-red-800">❌ {error}</div>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingMember ? 'Edit Editorial Board Member' : 'Add New Editorial Board Member'}
              </h2>
              
              <form onSubmit={editingMember ? handleUpdateMember : handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliation *
                    </label>
                    <input
                      type="text"
                      value={formData.affiliation}
                      onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Button */}
          {!showAddForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add New Member
              </button>
            </div>
          )}

          {/* Members List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Editorial Board Members ({members.length})
              </h3>
            </div>
            
            {members.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No editorial board members found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {members.map((member) => (
                  <div key={member.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          {member.photo_url && (
                            <Image
                              src={member.photo_url}
                              alt={member.name}
                              width={64}
                              height={64}
                              className="h-16 w-16 rounded-full object-cover"
                              unoptimized
                            />
                          )}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-600 font-medium">
                              {member.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.affiliation}
                            </p>
                            {member.email && (
                              <p className="text-sm text-blue-600">
                                {member.email}
                              </p>
                            )}
                            {member.bio && (
                              <p className="text-sm text-gray-600 mt-2">
                                {member.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(member)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
