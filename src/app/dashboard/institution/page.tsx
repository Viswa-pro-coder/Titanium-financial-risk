'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KPICards } from '@/components/dashboard/institution/kpi-cards'
import { RiskHeatmap } from '@/components/dashboard/institution/risk-heatmap'
import { TrendChart } from '@/components/dashboard/institution/trend-chart'
import { RiskBarChart } from '@/components/dashboard/institution/risk-bar-chart'
import { AlertsTable } from '@/components/dashboard/institution/alerts-table'
import { useInstitutionMetrics } from '@/hooks/useInstitutionMetrics'
import { useInstitutionAnalytics } from '@/hooks/useInstitutionAnalytics'
import { useAuth } from '@/app/contexts/authContext'
import { UniversalUpload } from '@/components/shared/universal-upload'
import { DashboardSkeleton } from '@/components/ui/skeleton'
// institutionKPIs, institutionTrendData, institutionAlerts removed
import { useMemo } from 'react'

export default function InstitutionDashboard() {
  const { loading: authLoading } = useAuth()
  const { metrics, loading: metricsLoading } = useInstitutionMetrics()
  const { heatmapData, riskDistribution, loading: analyticsLoading } = useInstitutionAnalytics()

  if (authLoading) return <AppLayout><DashboardSkeleton /></AppLayout>

  const liveKPIs = useMemo(() => {
    return [
      {
        label: 'Total Customers',
        value: metrics?.total_customers?.toLocaleString() || '0',
        change: 0,
        trend: 'stable' as const,
      },
      {
        label: 'Avg Risk Score',
        value: metrics ? Math.round(metrics.average_risk || 0).toString() : '0',
        change: 0,
        trend: 'stable' as const,
      },
      {
        label: 'Critical Cases',
        value: metrics?.critical_count?.toString() || '0',
        change: 0,
        trend: 'stable' as const,
      },
      {
        label: 'Compliance Rate',
        value: metrics ? `${Math.round(metrics.compliance_rate || 0)}%` : '0%',
        change: 0,
        trend: 'stable' as const,
      },
    ]
  }, [metrics])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">
            Institution Risk Portal
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage customer risk across your institution
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards metrics={liveKPIs} />

        {/* Heatmap and Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={analyticsLoading ? "opacity-50" : ""}>
            <RiskHeatmap data={heatmapData} />
          </div>
          <TrendChart data={[]} />
        </div>

        {/* Risk by Demographics */}
        <div className={analyticsLoading ? "opacity-50" : ""}>
          <RiskBarChart data={riskDistribution} />
        </div>

        {/* Alerts Table & Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertsTable alerts={[]} />
          </div>
          <div>
            <UniversalUpload module="institution" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
