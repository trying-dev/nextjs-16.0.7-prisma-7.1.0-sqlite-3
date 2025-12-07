'use client'

import { useState, useTransition } from 'react'
import { deleteUser, updateUser } from '../actions'

type UserWithPosts = {
  id: number
  name: string | null
  email: string
  posts: Array<{
    id: number
    title: string
    published: boolean
  }>
}

interface UserBoardColumnProps {
  title: string
  users: UserWithPosts[]
}

export function UserBoardColumn({ title, users }: UserBoardColumnProps) {
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleEdit = (user: UserWithPosts) => {
    const nameInput = prompt('Name', user.name || '')
    const emailInput = prompt('Email', user.email)

    const newName = (nameInput ?? user.name ?? '').trim()
    const newEmail = (emailInput ?? user.email).trim()

    if (!newEmail || (newName === (user.name || '').trim() && newEmail === user.email)) return

    const formData = new FormData()
    formData.append('name', newName.trim())
    formData.append('email', newEmail.trim())

    startTransition(async () => {
      setPendingId(user.id)
      const result = await updateUser(user.id, formData)
      if (result.error) alert(result.error)
      setPendingId(null)
    })
  }

  const handleDelete = (user: UserWithPosts) => {
    if (!confirm(`Delete ${user.name || user.email} and their ${user.posts.length} posts?`)) return

    startTransition(async () => {
      setPendingId(user.id)
      const result = await deleteUser(user.id)
      if (result.error) alert(result.error)
      setPendingId(null)
    })
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 shadow-inner shadow-slate-900/40">
      <div className="mb-3 flex items-center justify-between border-b border-dashed border-purple-500/50 pb-2">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <span className="text-sm font-medium text-purple-200">{users.length}</span>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-slate-500">No users</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => {
            const publishedCount = user.posts.filter((p) => p.published).length
            const draftsCount = user.posts.length - publishedCount

            return (
              <li
                key={user.id}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-3"
              >
                <span className="mt-1 text-slate-500">•</span>

                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-100">{user.name || 'No name'}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>

                  <div className="mt-2 flex gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                    <span className="rounded-full border border-blue-500/40 px-2 py-0.5">
                      {user.posts.length} posts
                    </span>
                    {publishedCount > 0 && (
                      <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-emerald-300">
                        {publishedCount} published
                      </span>
                    )}
                    {draftsCount > 0 && (
                      <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-amber-300">
                        {draftsCount} drafts
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEdit(user)}
                    disabled={isPending && pendingId === user.id}
                    className="rounded-lg px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-60"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    disabled={isPending && pendingId === user.id}
                    className="rounded-lg px-2 py-1 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
