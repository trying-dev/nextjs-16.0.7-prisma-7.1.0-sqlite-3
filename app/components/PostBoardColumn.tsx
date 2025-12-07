'use client'

import { useTransition, useState } from 'react'
import { deletePost, togglePostPublished, updatePost } from '../actions'

type PostWithAuthor = {
  id: number
  title: string
  content: string | null
  published: boolean
  author: {
    name: string | null
    email: string
  }
}

interface PostBoardColumnProps {
  title: string
  posts: PostWithAuthor[]
  accent?: 'blue' | 'emerald' | 'amber'
  emptyLabel?: string
}

const accentStyles = {
  blue: 'border-blue-500/60 text-blue-200',
  emerald: 'border-emerald-500/60 text-emerald-200',
  amber: 'border-amber-500/70 text-amber-200',
} as const

export function PostBoardColumn({
  title,
  posts,
  accent = 'blue',
  emptyLabel = 'No posts yet',
}: PostBoardColumnProps) {
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (post: PostWithAuthor) => {
    startTransition(async () => {
      setPendingId(post.id)
      const result = await togglePostPublished(post.id, !post.published)
      if (result.error) alert(result.error)
      setPendingId(null)
    })
  }

  const handleEdit = (post: PostWithAuthor) => {
    const newTitle = prompt('New title', post.title)?.trim()
    if (!newTitle || newTitle === post.title) return

    const formData = new FormData()
    formData.append('title', newTitle)
    formData.append('published', String(post.published))

    startTransition(async () => {
      setPendingId(post.id)
      const result = await updatePost(post.id, formData)
      if (result.error) alert(result.error)
      setPendingId(null)
    })
  }

  const handleDelete = (post: PostWithAuthor) => {
    if (!confirm(`Delete "${post.title}"?`)) return

    startTransition(async () => {
      setPendingId(post.id)
      const result = await deletePost(post.id)
      if (result.error) alert(result.error)
      setPendingId(null)
    })
  }

  const accentClass = accentStyles[accent]

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 shadow-inner shadow-slate-900/40">
      <div className={`mb-3 flex items-center justify-between border-b border-dashed pb-2 ${accentClass}`}>
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <span className="text-sm font-medium">{posts.length}</span>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-3"
            >
              <span className="mt-1 text-slate-500">•</span>

              <div className="flex-1">
                <p className="text-base font-semibold text-slate-100">{post.title}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="truncate">{post.author.name || post.author.email}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                      post.published
                        ? 'border-emerald-500/40 text-emerald-300'
                        : 'border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleToggle(post)}
                  disabled={isPending && pendingId === post.id}
                  className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                    post.published
                      ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                      : 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
                  } ${isPending && pendingId === post.id ? 'opacity-60' : ''}`}
                >
                  {isPending && pendingId === post.id ? '...' : post.published ? 'Hide' : 'Publish'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(post)}
                    disabled={isPending && pendingId === post.id}
                    className="rounded-lg px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:opacity-60"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={isPending && pendingId === post.id}
                    className="rounded-lg px-2 py-1 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
