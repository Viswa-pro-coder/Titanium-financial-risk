'use client'

import { TrendingDown, TrendingUp, Users, AlertTriangle, CheckCircle, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KPIMetric } from '@/lib/types'
import { cn } from '@/lib/utils'

interface KPICardsProps {
  metrics: KPIMetric[]
}

export function KPICards({ metrics }: KPICardsProps) {
  const getIcon = (index: number) => {
    const icons = [Users, AlertTriangle, TrendingUp, CheckCircle]
    return icons[index % icons.length]
  }

  const getColor = (index: number) => {
    const colors = [
      { bg: 'from-blue-500/10 to-blue-500/5', text: 'text-blue-500' },
      { bg: 'from-rose-500/10 to-rose-500/5', text: 'text-rose-500' },
      { bg: 'from-amber-500/10 to-amber-500/5', text: 'text-amber-500' },
      { bg: 'from-emerald-500/10 to-emerald-500/5', text: 'text-emerald-500' },
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = getIcon(index)
        const color = getColor(index)
        const TrendIcon =
          metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Zap

        return (
          <Card key={index} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <p className={cn('text-2xl font-bold', color.text)}>
                      {metric.value}
                    </p>
                    {metric.unit && (
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {metric.unit}
                      </p>
                    )}
                  </div>

                  {metric.change !== undefined && (
                    <div className="mt-2 flex items-center gap-1">
                      <TrendIcon
                        className={cn(
                          'h-4 w-4',
                          metric.trend === 'up'
                            ? 'text-rose-500'
                            : metric.trend === 'down'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          metric.trend === 'up'
                            ? 'text-rose-500'
                            : metric.trend === 'down'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                        )}
                      >
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className={cn('p-2 rounded-lg bg-gradient-to-br', color.bg)}>
                  <Icon className={cn('h-5 w-5', color.text)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
