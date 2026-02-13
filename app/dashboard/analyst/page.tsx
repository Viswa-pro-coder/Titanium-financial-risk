'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KanbanBoard } from '@/components/dashboard/analyst/kanban-board'
import { QuickStats } from '@/components/dashboard/analyst/quick-stats'
import { BatchUpload } from '@/components/dashboard/analyst/batch-upload'
import { ReportTemplates } from '@/components/dashboard/analyst/report-templates'
import { ResearchPanel } from '@/components/dashboard/analyst/research-panel'
import {
  analystKanbanCards,
  analystQuickStats,
  reportTemplates,
} from '@/lib/mock-data'

export default function AnalystDashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">
            Analyst Workbench
          </h1>
          <p className="text-muted-foreground">
            Manage client portfolios, generate reports, and research insights
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={analystQuickStats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kanban Board */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg bg-card p-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Client Portfolio
              </h2>
              <KanbanBoard cards={analystKanbanCards} />
            </div>
          </div>

          {/* Research Panel */}
          <ResearchPanel />
        </div>

        {/* Batch Upload */}
        <BatchUpload />

        {/* Report Templates */}
        <ReportTemplates templates={reportTemplates} />
      </div>
    </AppLayout>
  )
}
