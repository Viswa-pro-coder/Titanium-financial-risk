'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to consumer dashboard by default
    router.push('/dashboard/consumer')
  }, [router])

  return null
}
