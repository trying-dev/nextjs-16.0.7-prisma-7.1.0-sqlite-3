'use client'

import { useState, useTransition } from 'react'
import { deletePost, updatePost, togglePostPublished } from '../actions'

interface Post {
  id: number
  title: string
  content: string | null
  published: boolean
  author: {
    id: number
    name: string | null
    email: string
  }
}

interface PostCardInteractiveProps {
  post: Post
}

export function PostCardInteractive({ post }: PostCardInteractiveProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content || '',
    published: post.published,
  })

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    startTransition(async () => {
      setIsDeleting(true)
      const result = await deletePost(post.id)
      if (result.error) {
        alert(result.error)
        setIsDeleting(false)
      }
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', editData.title)
    formData.append('content', editData.content)
    formData.append('published', String(editData.published))

    startTransition(async () => {
      const result = await updatePost(post.id, formData)
      if (result.error) {
        alert(result.error)
      } else {
        setIsEditing(false)
      }
    })
  }

  const handleTogglePublished = async () => {
    startTransition(async () => {
      const result = await togglePostPublished(post.id, !post.published)
      if (result.error) {
        alert(result.error)
      }
    })
  }

  const truncateContent = (text: string | null, length: number) => {
    if (!text) return ''
    return text.length > length ? text.slice(0, length) + '...' : text
  }

  if (isDeleting) {
    return (
      <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 opacity-50">
        <p className="text-center text-slate-400">Deleting...</p>
      </article>
    )
  }

  if (isEditing) {
    return (
      <article className="rounded-xl border border-blue-500/50 bg-slate-900/80 p-6 shadow-lg shadow-blue-500/10">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isPending}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`published-${post.id}`}
              checked={editData.published}
              onChange={(e) => setEditData({ ...editData, published: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
              disabled={isPending}
            />
            <label htmlFor={`published-${post.id}`} className="text-sm text-slate-300">
              Published
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    )
  }

  return (
    <article className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-slate-700 hover:shadow-xl">
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">#{post.id}</span>
              <button
                onClick={handleTogglePublished}
                disabled={isPending}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                  post.published
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                {isPending ? '...' : post.published ? 'Published' : 'Draft'}
              </button>
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400">{post.title}</h3>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-blue-400"
              title="Edit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'}`}
        >
          <p className="text-sm text-slate-300 leading-relaxed">
            {isExpanded ? post.content : truncateContent(post.content, 100)}
          </p>
        </div>

        {post.content && post.content.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{post.author.name || 'No name'}</p>
            <p className="truncate text-xs text-slate-400">{post.author.email}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
