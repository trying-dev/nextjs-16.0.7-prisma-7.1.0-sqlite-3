import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js + Prisma + SQLite',
  description: 'Ejemplo con las últimas versiones',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  )
}
