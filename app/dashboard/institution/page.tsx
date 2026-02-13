'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KPICards } from '@/components/dashboard/institution/kpi-cards'
import { RiskHeatmap } from '@/components/dashboard/institution/risk-heatmap'
import { TrendChart } from '@/components/dashboard/institution/trend-chart'
import { RiskBarChart } from '@/components/dashboard/institution/risk-bar-chart'
import { AlertsTable } from '@/components/dashboard/institution/alerts-table'
import {
  institutionKPIs,
  institutionTrendData,
  institutionAlerts,
  institutionHeatmapData,
  institutionRiskByDemographic,
} from '@/lib/mock-data'

export default function InstitutionDashboard() {
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
        <KPICards metrics={institutionKPIs} />

        {/* Heatmap and Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskHeatmap data={institutionHeatmapData} />
          <TrendChart data={institutionTrendData} />
        </div>

        {/* Risk by Demographics */}
        <RiskBarChart data={institutionRiskByDemographic} />

        {/* Alerts Table */}
        <AlertsTable alerts={institutionAlerts} />
      </div>
    </AppLayout>
  )
}
