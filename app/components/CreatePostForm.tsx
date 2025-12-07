'use client'

import { useState, useTransition } from 'react'
import { createPost } from '../actions'

interface CreatePostFormProps {
  users: Array<{
    id: number
    name: string | null
    email: string
  }>
}

export function CreatePostForm({ users }: CreatePostFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorId: users[0]?.id || 0,
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append('title', formData.title)
    data.append('content', formData.content)
    data.append('authorId', String(formData.authorId))
    data.append('published', String(formData.published))

    startTransition(async () => {
      const result = await createPost(data)
      if (result.error) {
        alert(result.error)
      } else {
        setFormData({
          title: '',
          content: '',
          authorId: users[0]?.id || 0,
          published: false,
        })
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Post
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-blue-500/50 bg-slate-900/80 p-6 shadow-lg shadow-blue-500/10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Create New Post</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Post title"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Write the post content..."
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Author *</label>
          <select
            value={formData.authorId}
            onChange={(e) => setFormData({ ...formData, authorId: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            required
            disabled={isPending}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published-new"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
            disabled={isPending}
          />
          <label htmlFor="published-new" className="text-sm text-slate-300">
            Publish immediately
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
