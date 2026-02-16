import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export interface ClientCard {
    id: string
    name: string
    riskScore: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    trend: 'up' | 'down' | 'stable'
    arr: string
    lastContact: string
}

export function useAnalystClients() {
    const { user } = useAuth()
    const [clients, setClients] = useState<ClientCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return

        // Analyst data is expected to be under analysts/{userId}/client_links
        // For each link, we need to fetch the actual user data if needed, 
        // or the link itself might contain summary info.
        // Based on seedB2Pro.js, it's analystRef.collection('client_links')

        const analystId = user.uid
        const clientsRef = collection(db, 'analysts', analystId, 'client_links')

        const unsubscribe = onSnapshot(clientsRef, async (snapshot) => {
            try {
                const clientList: ClientCard[] = []

                for (const linkDoc of snapshot.docs) {
                    const linkData = linkDoc.data()

                    // In a real app, we'd fetch the user's risk_snapshot
                    // For now, let's check if the client data exists in the link or fetch it
                    const clientId = linkData.clientId

                    // Let's try to get some details from the user's snapshot
                    // (assuming the analyst has permissions)
                    const riskDoc = await getDoc(doc(db, 'users', clientId, 'risk_snapshots', 'latest'))
                    const riskData = riskDoc.data()
                    const userDoc = await getDoc(doc(db, 'users', clientId))
                    const userData = userDoc.data()

                    clientList.push({
                        id: clientId,
                        name: userData?.displayName || userData?.email?.split('@')[0] || 'Unknown Client',
                        riskScore: riskData?.value || 50,
                        riskLevel: getRiskLevel(riskData?.value || 50),
                        trend: riskData?.trend || 'stable',
                        arr: `₹${(Math.random() * 50000 + 10000).toLocaleString()}`, // Mock ARR for now as it's not in DB
                        lastContact: linkData.assignedAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
                    })
                }

                // If no clients found in Firestore, we'll keep the list empty
                // The dashboard can decide to show mock or empty state
                setClients(clientList)
                setLoading(false)
            } catch (err: any) {
                console.error('Error fetching analyst clients:', err)
                setError(err.message)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [user])

    return { clients, loading, error }
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score > 80) return 'critical'
    if (score > 60) return 'high'
    if (score > 35) return 'medium'
    return 'low'
}
