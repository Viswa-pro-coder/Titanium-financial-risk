'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { RiskScoreGauge } from '@/components/dashboard/consumer/risk-score-gauge'
import { StatsCards } from '@/components/dashboard/consumer/stats-cards'
import { SpendingCharts } from '@/components/dashboard/consumer/spending-charts'
import { TransactionsTable } from '@/components/dashboard/consumer/transactions-table'
import { AlertsCenter } from '@/components/dashboard/consumer/alerts-center'
import { useRiskScore } from '@/hooks/useRiskScore'
import { useTransactions } from '@/hooks/useTransactions'
import { useAlerts } from '@/hooks/useAlerts'
import { useSpendingData } from '@/hooks/useSpendingData'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/app/contexts/authContext'
import { UniversalUpload } from '@/components/shared/universal-upload'
// consumerMetrics, consumerSpendingByCategory, consumerSpendingTrend removed for clean state
import { useMemo } from 'react'
import { RiskLevel } from '@/lib/types'

export default function ConsumerDashboard() {
  const { loading: authLoading } = useAuth()
  const { score, loading: riskLoading } = useRiskScore()
  const { transactions, loading: txLoading } = useTransactions(10)
  const { alerts, loading: alertsLoading, acknowledgeAlert } = useAlerts()

  if (authLoading) return <AppLayout><DashboardSkeleton /></AppLayout>

  // Map Firebase risk score to UI format
  const riskScoreData = useMemo(() => {
    if (!score) return {
      value: 0,
      trend: 'stable' as const,
      lastUpdated: new Date(),
      label: 'Low Risk' as const,
      riskLevel: 'low' as const
    }

    const val = score.value || 0
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (val > 80) level = 'critical'
    else if (val > 60) level = 'high'
    else if (val > 30) level = 'medium'

    return {
      value: val,
      trend: (score.trend || 'stable') as 'up' | 'down' | 'stable',
      lastUpdated: score.timestamp?.toDate() || new Date(),
      label: (level === 'critical' ? 'Critical Risk' : level === 'high' ? 'High Risk' : level === 'medium' ? 'Moderate Risk' : 'Low Risk') as 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk',
      riskLevel: level as RiskLevel
    }
  }, [score])

  // Map Firebase metrics to StatsCards format
  const metricsData = useMemo(() => {
    return {
      monthlySpending: score ? Math.abs(score.total_30d || 0) : 0,
      monthlyIncome: 0,
      emergencyFundStatus: 0,
      savingsProgress: 0,
      daysToPayday: 0,
      savingsGoal: 0,
    }
  }, [score])

  // Map Firebase transactions
  const processedTransactions = useMemo(() => {
    return transactions.map(tx => ({
      ...tx,
      id: tx.id,
      date: tx.timestamp?.toDate() || new Date(),
      description: tx.description || tx.merchantName || 'Transaction',
      amount: tx.amount,
      category: tx.category || 'other',
      merchantName: tx.merchantName || 'Unknown',
      riskFlag: tx.riskFlag || false
    }))
  }, [transactions])

  // Map Firebase alerts
  const processedAlerts = useMemo(() => {
    return alerts.map(alert => ({
      ...alert,
      id: alert.id,
      timestamp: alert.timestamp?.toDate() || new Date(),
      description: alert.message || alert.description,
    }))
  }, [alerts])

  const { spendingByCategory, spendingTrend, loading: spendingLoading } = useSpendingData()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">
            Financial Wellness Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your financial health and get personalized insights
          </p>
        </div>

        {/* Risk Score & Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskScoreGauge riskScore={riskScoreData} />
          <div className="lg:col-span-2">
            <StatsCards metrics={metricsData} />
          </div>
        </div>

        {/* Charts */}
        <div className={spendingLoading ? "opacity-50 pointer-events-none" : ""}>
          <SpendingCharts
            spendingByCategory={spendingByCategory}
            spendingTrend={spendingTrend}
          />
        </div>

        {/* Transactions and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionsTable transactions={processedTransactions} />
          </div>
          <div>
            <div className="space-y-6">
              <AlertsCenter alerts={processedAlerts} onAcknowledge={acknowledgeAlert} />
              <UniversalUpload module="consumer" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
