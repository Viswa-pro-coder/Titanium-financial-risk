import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export function useTransactions(limitCount = 50) {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setTransactions([])
            setLoading(false)
            return
        }

        const q = query(
            collection(db, 'users', user.uid, 'transactions'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        )

        const unsub = onSnapshot(q, (snapshot) => {
            setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
            setLoading(false)
        }, (err) => {
            console.error('Transactions error:', err)
            setLoading(false)
        })

        return unsub
    }, [user, limitCount])

    return { transactions, loading }
}
