'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { RiskScoreGauge } from '@/components/dashboard/consumer/risk-score-gauge'
import { StatsCards } from '@/components/dashboard/consumer/stats-cards'
import { SpendingCharts } from '@/components/dashboard/consumer/spending-charts'
import { TransactionsTable } from '@/components/dashboard/consumer/transactions-table'
import { AlertsCenter } from '@/components/dashboard/consumer/alerts-center'
import {
  consumerRiskScore,
  consumerMetrics,
  consumerTransactions,
  consumerAlerts,
  consumerSpendingByCategory,
  consumerSpendingTrend,
} from '@/lib/mock-data'

export default function ConsumerDashboard() {
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
          <RiskScoreGauge riskScore={consumerRiskScore} />
          <div className="lg:col-span-2">
            <StatsCards metrics={consumerMetrics} />
          </div>
        </div>

        {/* Charts */}
        <SpendingCharts
          spendingByCategory={consumerSpendingByCategory}
          spendingTrend={consumerSpendingTrend}
        />

        {/* Transactions and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionsTable transactions={consumerTransactions} />
          </div>
          <div>
            <AlertsCenter alerts={consumerAlerts} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
