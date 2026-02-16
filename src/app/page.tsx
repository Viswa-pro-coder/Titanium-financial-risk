'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/authContext'

export default function Page() {
  const router = useRouter()
  const { user, tier, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (tier === 'analyst') {
      router.push('/dashboard/analyst')
    } else if (tier === 'institution') {
      router.push('/dashboard/institution')
    } else {
      router.push('/dashboard/consumer')
    }
  }, [user, tier, loading, router])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-emerald-500 font-medium">
        Loading your experience...
      </div>
    </div>
  )
}
