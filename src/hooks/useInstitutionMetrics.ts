import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export function useInstitutionMetrics() {
    const { user } = useAuth()
    const [metrics, setMetrics] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        // Assuming the user is linked to an institution
        // For demo, we might use a hardcoded instId or fetch from user profile
        const instId = 'demo-institution'

        const unsub = onSnapshot(
            doc(db, 'institutions', instId, 'metrics', 'realtime'),
            (doc) => {
                setMetrics(doc.data())
                setLoading(false)
            },
            (err) => {
                console.error('Institution metrics error:', err)
                setLoading(false)
            }
        )

        return unsub
    }, [user])

    return { metrics, loading }
}
