'use client'

import AuthGuard from '@/components/layout/AuthGuard'
import NavBar from '@/components/layout/NavBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        {children}
      </div>
    </AuthGuard>
  )
} 