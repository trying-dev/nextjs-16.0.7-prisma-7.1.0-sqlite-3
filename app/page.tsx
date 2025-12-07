import { prisma } from '@/lib/prisma'
import { PostBoardColumn } from './components/PostBoardColumn'
import { UserBoardColumn } from './components/UserBoardColumn'
import { CreatePostForm } from './components/CreatePostForm'
import { CreateUserForm } from './components/CreateUserForm'

export const revalidate = 30

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return users
}

async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return posts
}

export default async function Home() {
  const [users, allPosts] = await Promise.all([getUsers(), getAllPosts()])

  const publishedPosts = allPosts.filter((p) => p.published)
  const totalPosts = allPosts.length
  const drafts = totalPosts - publishedPosts.length
  const draftPosts = allPosts.filter((p) => !p.published)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 space-y-12">
        <header className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Quick board</p>
            <h1 className="text-4xl font-bold text-slate-50">Posts and Users</h1>
            <p className="mt-2 text-slate-500">Board-style view: everything at hand without reloading.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Users', value: users.length },
              { label: 'Posts', value: totalPosts },
              { label: 'Published', value: publishedPosts.length },
              { label: 'Drafts', value: drafts },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-900 bg-slate-950/70 p-4 shadow-inner shadow-slate-900/40"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{stat.value}</p>
                <div className="mt-3 h-px bg-linear-to-r from-slate-700/70 via-slate-600/50 to-transparent" />
              </div>
            ))}
          </div>
        </header>

        <section className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6 shadow-xl shadow-slate-900/50">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-4 rounded-2xl border border-slate-900 bg-slate-950/50 p-5 shadow-inner shadow-slate-900/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Posts</p>
                  <p className="text-xs text-slate-500">
                    {totalPosts} total · {publishedPosts.length} published · {draftPosts.length} drafts
                  </p>
                </div>
                <CreatePostForm users={users} />
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
                <PostBoardColumn
                  title="Published"
                  posts={publishedPosts}
                  accent="emerald"
                  emptyLabel="No published posts yet"
                />
                <PostBoardColumn
                  title="Drafts"
                  posts={draftPosts}
                  accent="amber"
                  emptyLabel="No drafts yet"
                />
              </div>
            </div>

            <div className="lg:w-80 xl:w-96">
              <div className="flex flex-col gap-6 rounded-2xl border border-slate-900 bg-slate-950/50 p-5 shadow-inner shadow-slate-900/40">
                <UserBoardColumn title="Users" users={users} />

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/40">
                  <h3 className="mb-3 text-lg font-semibold text-slate-100">Create user</h3>
                  <CreateUserForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
