import { useState, useEffect, useMemo } from 'react'
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/app/contexts/authContext'

export function useInstitutionAnalytics() {
    const { user, tier } = useAuth()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const instId = 'demo-institution' // Hardcoded for demo as in useInstitutionMetrics

    useEffect(() => {
        if (!user || tier !== 'institution') return

        const usersRef = collection(db, 'institutions', instId, 'users')

        // In this demo, 'users' subcollection in institution might only have IDs
        // We need to fetch their actual risk snapshots
        const unsubscribe = onSnapshot(usersRef, async (snapshot) => {
            try {
                const userPromises = snapshot.docs.map(async (linkDoc) => {
                    const userId = linkDoc.id
                    const riskDoc = await getDoc(doc(db, 'users', userId, 'risk_snapshots', 'latest'))
                    return {
                        id: userId,
                        ...riskDoc.data()
                    }
                })

                const resolvedUsers = await Promise.all(userPromises)
                setUsers(resolvedUsers.filter(u => u && (u as any).value !== undefined))
                setLoading(false)
            } catch (err) {
                console.error('Error fetching institution users:', err)
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [user, tier])

    const heatmapData = useMemo(() => {
        // Generate a 10x10 heatmap based on user scores
        // For demo, we'll bucket users into 100 cells
        const cells = Array.from({ length: 100 }, (_, i) => ({
            id: i.toString(),
            risk: 0,
            segment: `Segment ${i + 1}`,
            count: 0,
            trend: 'stable' as const
        }))

        users.forEach(u => {
            const score = (u as any).value || 0
            const cellIndex = Math.min(99, Math.floor(score))
            cells[cellIndex].count++
            cells[cellIndex].risk = score // Average risk in this cell
        })

        return cells
    }, [users])

    const riskDistribution = useMemo(() => {
        const distribution = [
            { name: '0-20', count: 0, color: '#10b981' },
            { name: '21-40', count: 0, color: '#34d399' },
            { name: '41-60', count: 0, color: '#fbbf24' },
            { name: '61-80', count: 0, color: '#f59e0b' },
            { name: '81-100', count: 0, color: '#ef4444' }
        ]

        users.forEach(u => {
            const score = (u as any).value || 0
            if (score <= 20) distribution[0].count++
            else if (score <= 40) distribution[1].count++
            else if (score <= 60) distribution[2].count++
            else if (score <= 80) distribution[3].count++
            else distribution[4].count++
        })

        return distribution.map(d => ({
            name: d.name,
            value: d.count,
            color: d.color
        }))
    }, [users])

    return { heatmapData, riskDistribution, loading }
}
