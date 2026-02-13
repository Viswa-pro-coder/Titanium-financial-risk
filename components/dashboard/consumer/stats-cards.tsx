'use client'

import { useEffect, useState } from 'react'
import { TrendingDown, TrendingUp, Wallet, Target, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FinancialMetrics } from '@/lib/types'

interface StatsCardsProps {
  metrics: FinancialMetrics
}

export function StatsCards({ metrics }: StatsCardsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    spending: 0,
    income: 0,
    emergency: 0,
    savings: 0,
  })

  useEffect(() => {
    const duration = 600
    const steps = 30
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        spending: Math.round(metrics.monthlySpending * progress),
        income: Math.round(metrics.monthlyIncome * progress),
        emergency: Math.round(metrics.emergencyFundStatus * progress),
        savings: Math.round(metrics.savingsProgress * progress),
      })

      if (currentStep >= steps) clearInterval(interval)
    }, duration / steps)

    return () => clearInterval(interval)
  }, [metrics])

  const statCards = [
    {
      label: 'Monthly Spending',
      value: animatedValues.spending,
      icon: Wallet,
      color: 'from-orange-500/10 to-orange-500/5',
      textColor: 'text-orange-500',
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      label: 'Monthly Income',
      value: animatedValues.income,
      icon: TrendingUp,
      color: 'from-emerald-500/10 to-emerald-500/5',
      textColor: 'text-emerald-500',
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      label: 'Emergency Fund',
      value: animatedValues.emergency,
      icon: Target,
      color: 'from-blue-500/10 to-blue-500/5',
      textColor: 'text-blue-500',
      format: (v: number) => `${v}%`,
    },
    {
      label: 'Savings Progress',
      value: animatedValues.savings,
      icon: Calendar,
      color: 'from-purple-500/10 to-purple-500/5',
      textColor: 'text-purple-500',
      format: (v: number) => `$${v.toLocaleString()}`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border bg-gradient-to-br from-card to-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-2', stat.textColor)}>
                    {stat.format(stat.value)}
                  </p>
                </div>
                <div className={cn('p-2 rounded-lg bg-gradient-to-br', stat.color)}>
                  <Icon className={cn('h-5 w-5', stat.textColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
