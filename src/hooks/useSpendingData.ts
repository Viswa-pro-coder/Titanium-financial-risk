import { useMemo } from 'react'
import { useTransactions } from './useTransactions'

export function useSpendingData() {
    const { transactions, loading } = useTransactions(100)

    const spendingByCategory = useMemo(() => {
        if (loading || transactions.length === 0) return []

        const categories: Record<string, number> = {}
        let total = 0

        transactions.forEach((tx) => {
            // Only count debits for spending
            if (tx.amount < 0 || tx.type === 'debit') {
                const amount = Math.abs(tx.amount)
                const cat = tx.category || 'other'
                categories[cat] = (categories[cat] || 0) + amount
                total += amount
            }
        })

        const chartColors: Record<string, string> = {
            grocery: '#10b981',
            dining: '#f59e0b',
            transport: '#3b82f6',
            utilities: '#6366f1',
            entertainment: '#a855f7',
            shopping: '#ec4899',
            healthcare: '#ef4444',
            other: '#94a3b8'
        }

        return Object.entries(categories).map(([name, amount]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            amount,
            percentage: Math.round((amount / total) * 100),
            color: chartColors[name] || chartColors.other
        }))
    }, [transactions, loading])

    const spendingTrend = useMemo(() => {
        if (loading || transactions.length === 0) return []

        const dailySpend: Record<string, number> = {}

        // Last 7 days trend
        const now = new Date()
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(now.getDate() - i)
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            dailySpend[dateStr] = 0
        }

        transactions.forEach((tx) => {
            if (tx.amount < 0 || tx.type === 'debit') {
                const date = tx.timestamp?.toDate ? tx.timestamp.toDate() : new Date(tx.timestamp)
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                if (dailySpend[dateStr] !== undefined) {
                    dailySpend[dateStr] += Math.abs(tx.amount)
                }
            }
        })

        return Object.entries(dailySpend).map(([date, value]) => ({
            date,
            value
        }))
    }, [transactions, loading])

    return { spendingByCategory, spendingTrend, loading }
}
