import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export function useAlerts() {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setAlerts([])
            setLoading(false)
            return
        }

        const q = query(
            collection(db, 'users', user.uid, 'alerts'),
            orderBy('timestamp', 'desc')
        )

        const unsub = onSnapshot(q, (snapshot) => {
            setAlerts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
            setLoading(false)
        }, (err) => {
            console.error('Alerts error:', err)
            setLoading(false)
        })

        return unsub
    }, [user])

    const acknowledgeAlert = async (alertId: string) => {
        if (!user) return
        try {
            await updateDoc(doc(db, 'users', user.uid, 'alerts', alertId), {
                acknowledged: true
            })
        } catch (err) {
            console.error('Error acknowledging alert:', err)
        }
    }

    return { alerts, loading, acknowledgeAlert }
}
