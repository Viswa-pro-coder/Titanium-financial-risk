'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KanbanCard } from '@/lib/types'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface KanbanBoardProps {
  cards: Record<string, KanbanCard[]>
}

const COLUMNS = [
  { id: 'low', label: 'Low Risk', color: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/30' },
  { id: 'medium', label: 'Medium Risk', color: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/30' },
  { id: 'high', label: 'High Risk', color: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/30' },
  { id: 'critical', label: 'Critical Risk', color: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-500/30' },
]

export function KanbanBoard({ cards }: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null)
  const [dragSource, setDragSource] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDragStart = (card: KanbanCard, source: string) => {
    setDraggedCard(card)
    setDragSource(source)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
    setDragSource(null)
  }

  const getDaysAgo = (date: Date) => {
    return Math.round((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000))
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex flex-col gap-2">
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <h3 className="font-semibold text-sm text-foreground">{column.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {cards[column.id]?.length || 0}
              </Badge>
            </div>

            {/* Cards Container */}
            <div
              className={cn(
                'flex-1 rounded-lg border border-dashed p-3 space-y-2 min-h-96 bg-gradient-to-br',
                column.color,
                column.border,
                dragSource === column.id && 'bg-opacity-50'
              )}
              onDragOver={(e) => e.preventDefault()}
            >
              {cards[column.id]?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <p className="text-xs text-muted-foreground">No clients here</p>
                </div>
              ) : (
                cards[column.id]?.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card, column.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'p-3 rounded-lg border bg-card hover:shadow-md transition-all cursor-move',
                      column.border,
                      draggedCard?.id === card.id && 'opacity-50'
                    )}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {card.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${(card.revenue / 1000).toFixed(0)}k ARR
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {card.initials}
                      </div>
                    </div>

                    {/* Risk Score */}
                    <div className="mt-3 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <span className="text-sm font-semibold text-foreground">
                          {card.riskScore}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div
                          className={cn(
                            'h-full',
                            card.riskScore <= 30
                              ? 'bg-emerald-500'
                              : card.riskScore <= 60
                                ? 'bg-amber-500'
                                : card.riskScore <= 80
                                  ? 'bg-orange-500'
                                  : 'bg-rose-500'
                          )}
                          style={{ width: `${card.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="mt-2 flex items-center gap-1">
                      {card.riskTrend === 'up' ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-rose-500" />
                          <span className="text-xs text-rose-600">Rising</span>
                        </>
                      ) : card.riskTrend === 'down' ? (
                        <>
                          <TrendingDown className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">Improving</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Stable</span>
                      )}
                    </div>

                    {/* Last Contact */}
                    {isClient && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last contact: {getDaysAgo(card.lastContact)} days ago
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
