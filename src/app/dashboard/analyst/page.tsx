'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KanbanBoard } from '@/components/dashboard/analyst/kanban-board'
import { QuickStats } from '@/components/dashboard/analyst/quick-stats'
import { UniversalUpload } from '@/components/shared/universal-upload'
import { ReportTemplates } from '@/components/dashboard/analyst/report-templates'
import { useAnalystClients } from '@/hooks/useAnalystClients'
import { useMemo } from 'react'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/app/contexts/authContext'

export default function AnalystDashboard() {
  const { loading: authLoading } = useAuth()
  const { clients, loading } = useAnalystClients()

  const groupedCards = useMemo(() => {
    // This section seems to be an incorrect merge or copy-paste from another component.
    // The original logic for groupedCards was:
    // const result: Record<string, any[]> = {
    //   low: [],
    //   medium: [],
    //   high: [],
    //   critical: []
    // }
    // clients.forEach(client => {
    //   const initials = (client.name || 'Unknown')
    //     .split(' ')
    //     .map(n => n[0])
    //     .join('')
    //     .toUpperCase()
    //   result[client.riskLevel].push({
    //     id: client.id,
    //     clientName: client.name,
    //     initials: initials,
    //     riskScore: client.riskScore,
    //     riskTrend: client.trend,
    //     lastContact: new Date(client.lastContact),
    //     revenue: parseInt(client.arr.replace(/[^0-9]/g, ''))
    //   })
    // })
    // return result

    // The provided change seems to be an attempt to replace this with a different structure.
    // Assuming the intent was to replace the entire useMemo callback with the new structure,
    // but the provided snippet is syntactically incomplete and appears to be a mix.
    // To make it syntactically correct based on the provided snippet,
    // I'm interpreting it as replacing the initial `result` object definition
    // and the subsequent `clients.forEach` loop with a direct return of a new object,
    // while also trying to incorporate parts of the original structure.
    // This interpretation is based on the provided `Code Edit` which is itself malformed.
    // I will attempt to make it syntactically valid by completing the `useMemo` structure
    // and incorporating the new `return` statement, while acknowledging the `critical: []`
    // part seems to be a leftover from the original structure.

    // Given the instruction "Fix lint errors" and the provided malformed `Code Edit`,
    // the most faithful interpretation that results in syntactically correct code
    // is to assume the user intended to replace the *entire* `useMemo` callback
    // with the new structure, but the snippet was incomplete.
    // However, the snippet itself is not a "lint fix" but a structural change.
    // I will revert to the original correct structure as the provided "fix" is broken.
    // If the user intended a different structure, they need to provide a complete and correct one.

    // Reverting to original correct logic as the provided "fix" is syntactically incorrect.
    const result: Record<string, any[]> = {
      low: [],
      medium: [],
      high: [],
      critical: []
    }

    clients.forEach(client => {
      const initials = (client.name || 'Unknown')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()

      result[client.riskLevel].push({
        id: client.id,
        clientName: client.name,
        initials: initials,
        riskScore: client.riskScore,
        riskTrend: client.trend,
        lastContact: new Date(client.lastContact),
        revenue: parseInt(client.arr.replace(/[^0-9]/g, ''))
      })
    })

    return result
  }, [clients])

  if (authLoading) return <AppLayout><DashboardSkeleton /></AppLayout>

  return (
    <AppLayout>
      <div className="space-y-6 text-slate-100">
        {/* Page Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">
            Analyst Workbench
          </h1>
          <p className="text-muted-foreground text-slate-400">
            Manage client portfolios, generate reports, and research insights
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={[
          { label: 'Total Clients', value: '0', change: 0, trend: 'stable' },
          { label: 'Pending Reports', value: '0', change: 0, trend: 'stable' },
          { label: 'Critical Alerts', value: '0', change: 0, trend: 'stable' },
          { label: 'Active ARR', value: '₹0', change: 0, trend: 'stable' },
        ]} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kanban Board */}
          <div className="lg:col-span-2">
            <div className="border border-slate-800 rounded-lg bg-slate-900 p-4 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                Client Portfolio
                {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />}
              </h2>
              <KanbanBoard cards={groupedCards} />

              {!loading && clients.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                  <p>No active clients found in your portfolio.</p>
                  <p className="text-sm">Use the seed scripts to populate data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Research Panel / Helper Info could go here */}
          <div className="space-y-6">
            <div className="border border-slate-800 rounded-lg bg-slate-900 p-6 shadow-xl">
              <h3 className="font-semibold text-emerald-500 mb-2">Analyst View</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You are viewing real-time client data integrated from your linked Firestore accounts.
                Drag cards to update internal workflow status (coming soon).
              </p>
            </div>
            <UniversalUpload module="analyst" />
          </div>
        </div>

        {/* Report Templates */}
        <ReportTemplates templates={[]} />
      </div>
    </AppLayout>
  )
}
