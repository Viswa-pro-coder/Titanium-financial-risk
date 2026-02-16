import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export function useRiskScore() {
    const { user } = useAuth()
    const [score, setScore] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setScore(null)
            setLoading(false)
            return
        }

        const unsub = onSnapshot(
            doc(db, 'users', user.uid, 'risk_snapshots', 'latest'),
            (doc) => {
                setScore(doc.data())
                setLoading(false)
            },
            (err) => {
                console.error('Risk score error:', err)
                setLoading(false)
            }
        )

        return unsub
    }, [user])

    return { score, loading }
}
