'use client'

import { useState, useTransition } from 'react'
import { createUser } from '../actions'

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append('name', formData.name)
    data.append('email', formData.email)

    startTransition(async () => {
      const result = await createUser(data)
      if (result.error) {
        alert(result.error)
      } else {
        setFormData({
          name: '',
          email: '',
        })
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create User
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-purple-500/50 bg-slate-900/80 p-6 shadow-lg shadow-purple-500/10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Create New User</h3>
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
          <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="User name"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="email@example.com"
            required
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create User'}
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
