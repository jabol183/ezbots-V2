'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import UserMenu from './UserMenu'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading: isSigningOut } = useAuth()

  const isActivePath = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                EzAIBotz
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className={`${
                  isActivePath('/dashboard') && !isActivePath('/dashboard/chatbots') && !isActivePath('/dashboard/analytics')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/chatbots" 
                className={`${
                  isActivePath('/dashboard/chatbots')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Chatbots
              </Link>
              <Link 
                href="/dashboard/analytics" 
                className={`${
                  isActivePath('/dashboard/analytics')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Analytics
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}