'use client'

import { TrendingDown, TrendingUp, Users, AlertTriangle, BarChart3, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { KPIMetric } from '@/lib/types'
import { cn } from '@/lib/utils'

interface QuickStatsProps {
  stats: KPIMetric[]
}

export function QuickStats({ stats }: QuickStatsProps) {
  const getIcon = (index: number) => {
    const icons = [Users, AlertTriangle, BarChart3, DollarSign]
    return icons[index % icons.length]
  }

  const getColor = (index: number) => {
    const colors = [
      { bg: 'from-blue-500/10 to-blue-500/5', text: 'text-blue-500', border: 'border-blue-500/30' },
      { bg: 'from-rose-500/10 to-rose-500/5', text: 'text-rose-500', border: 'border-rose-500/30' },
      { bg: 'from-amber-500/10 to-amber-500/5', text: 'text-amber-500', border: 'border-amber-500/30' },
      { bg: 'from-emerald-500/10 to-emerald-500/5', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = getIcon(index)
        const color = getColor(index)
        const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : BarChart3

        return (
          <Card key={index} className={cn('border-border bg-gradient-to-br', color.bg)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-2', color.text)}>
                    {stat.value}
                  </p>

                  {stat.change !== undefined && (
                    <div className="mt-2 flex items-center gap-1">
                      <TrendIcon
                        className={cn(
                          'h-4 w-4',
                          stat.trend === 'up'
                            ? 'text-rose-500'
                            : stat.trend === 'down'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          stat.trend === 'up'
                            ? 'text-rose-500'
                            : stat.trend === 'down'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                        )}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className={cn('p-2 rounded-lg bg-gradient-to-br', color.bg, color.border, 'border')}>
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
