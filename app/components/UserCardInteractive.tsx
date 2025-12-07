'use client'

import { useState, useTransition } from 'react'
import { deleteUser, updateUser } from '../actions'

interface User {
  id: number
  name: string | null
  email: string
  posts: Array<{
    id: number
    title: string
    published: boolean
  }>
}

interface UserCardInteractiveProps {
  user: User
}

export function UserCardInteractive({ user }: UserCardInteractiveProps) {
  const [showPosts, setShowPosts] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [editData, setEditData] = useState({
    name: user.name || '',
    email: user.email,
  })

  const publishedCount = user.posts.filter((p) => p.published).length

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${user.name || user.email}? This will also delete all their posts (${user.posts.length}).`
      )
    )
      return

    startTransition(async () => {
      setIsDeleting(true)
      const result = await deleteUser(user.id)
      if (result.error) {
        alert(result.error)
        setIsDeleting(false)
      }
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', editData.name)
    formData.append('email', editData.email)

    startTransition(async () => {
      const result = await updateUser(user.id, formData)
      if (result.error) {
        alert(result.error)
      } else {
        setIsEditing(false)
      }
    })
  }

  if (isDeleting) {
    return (
      <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 opacity-50">
        <p className="text-center text-slate-400">Deleting user and their posts...</p>
      </article>
    )
  }

  if (isEditing) {
    return (
      <article className="rounded-xl border border-purple-500/50 bg-slate-900/80 p-6 shadow-lg shadow-purple-500/10">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="User name"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
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
              <span className="text-xs font-medium text-slate-500">ID {user.id}</span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                {user.posts.length} posts
              </span>
              {publishedCount > 0 && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  {publishedCount} published
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400">{user.name || 'No name'}</h3>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-purple-400"
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

        {user.posts.length > 0 && (
          <>
            <button
              onClick={() => setShowPosts(!showPosts)}
              className="mb-3 flex w-full items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              <span>{showPosts ? 'Hide posts' : 'View posts'}</span>
              <svg
                className={`h-4 w-4 transition-transform ${showPosts ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                showPosts ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-2 border-t border-slate-800 pt-3">
                {user.posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2 text-sm transition-colors hover:bg-slate-800/50"
                  >
                    <span className="flex-1 truncate text-slate-300">{post.title}</span>
                    <span
                      className={`ml-2 text-xs ${post.published ? 'text-emerald-400' : 'text-amber-400'}`}
                    >
                      {post.published ? '✓' : '◐'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user.posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-800 bg-slate-800/30 p-3 text-center text-sm text-slate-400">
            No posts yet
          </div>
        )}
      </div>
    </article>
  )
}
