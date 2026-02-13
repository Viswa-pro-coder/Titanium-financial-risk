'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeatmapCell } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskHeatmapProps {
  data: HeatmapCell[]
}

export function RiskHeatmap({ data }: RiskHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'bg-emerald-500/80'
    if (risk < 40) return 'bg-lime-500/80'
    if (risk < 60) return 'bg-amber-500/80'
    if (risk < 80) return 'bg-orange-500/80'
    return 'bg-rose-500/80'
  }

  const getRiskLabel = (risk: number) => {
    if (risk < 20) return 'Low'
    if (risk < 40) return 'Low-Med'
    if (risk < 60) return 'Medium'
    if (risk < 80) return 'High'
    return 'Critical'
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Customer Risk Heatmap</CardTitle>
        <CardDescription>Risk distribution across customer segments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="grid grid-cols-10 gap-1">
            {data.map((cell) => (
              <div
                key={cell.id}
                className={cn(
                  'aspect-square rounded cursor-pointer transition-all duration-200',
                  getRiskColor(cell.risk),
                  hoveredCell === cell.id && 'ring-2 ring-primary scale-110 z-10'
                )}
                onMouseEnter={() => setHoveredCell(cell.id)}
                onMouseLeave={() => setHoveredCell(null)}
                title={`${cell.segment}: ${cell.count} customers, Risk: ${cell.risk}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-5 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-emerald-500/80" />
                <span className="text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-lime-500/80" />
                <span className="text-muted-foreground">Low-Med</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-amber-500/80" />
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-orange-500/80" />
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-rose-500/80" />
                <span className="text-muted-foreground">Critical</span>
              </div>
            </div>
          </div>

          {/* Hovered Cell Details */}
          {hoveredCell && (
            <div className="bg-secondary rounded-lg p-3 border border-border">
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {data.find((c) => c.id === hoveredCell)?.segment}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Risk Score</p>
                    <p className="font-semibold text-foreground">
                      {data.find((c) => c.id === hoveredCell)?.risk}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Customers</p>
                    <p className="font-semibold text-foreground">
                      {data.find((c) => c.id === hoveredCell)?.count}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <p className="font-semibold text-foreground">
                      {data.find((c) => c.id === hoveredCell)?.trend === 'up'
                        ? '↑'
                        : data.find((c) => c.id === hoveredCell)?.trend === 'down'
                          ? '↓'
                          : '→'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
