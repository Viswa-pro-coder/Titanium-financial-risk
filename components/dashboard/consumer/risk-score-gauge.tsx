'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskScore } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskScoreGaugeProps {
  riskScore: RiskScore
}

export function RiskScoreGauge({ riskScore }: RiskScoreGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const duration = 1000 // 1 second animation
    const steps = 60
    const increment = riskScore.value / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setDisplayValue(Math.min(currentStep * increment, riskScore.value))

      if (currentStep >= steps) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [riskScore.value, isAnimating])

  // Determine color based on score
  const getColor = (score: number) => {
    if (score <= 30) return { bg: 'from-emerald-500', text: 'text-emerald-500', label: 'Low Risk' }
    if (score <= 60) return { bg: 'from-amber-500', text: 'text-amber-500', label: 'Moderate Risk' }
    if (score <= 80) return { bg: 'from-orange-500', text: 'text-orange-500', label: 'High Risk' }
    return { bg: 'from-rose-500', text: 'text-rose-500', label: 'Critical Risk' }
  }

  const color = getColor(riskScore.value)
  const percentage = (riskScore.value / 100) * 360

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Your Risk Score</CardTitle>
        <CardDescription>Overall financial wellness assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative h-48 w-48">
            {/* Background circle */}
            <svg
              className="absolute inset-0 h-full w-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={
                  riskScore.value <= 30
                    ? '#10b981'
                    : riskScore.value <= 60
                      ? '#f59e0b'
                      : riskScore.value <= 80
                        ? '#f97316'
                        : '#ef4444'
                }
                strokeWidth="8"
                strokeDasharray={`${(percentage / 360) * Math.PI * 100} ${Math.PI * 100}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className={cn('text-4xl font-bold', color.text)}>
                {Math.round(displayValue)}
              </div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          </div>

          {/* Label and Trend */}
          <div className="text-center">
            <p className={cn('text-sm font-semibold', color.text)}>
              {color.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {riskScore.trend === 'up'
                ? '↑ Trending up'
                : riskScore.trend === 'down'
                  ? '↓ Trending down'
                  : '→ Stable'}
            </p>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-muted-foreground">
            Updated{' '}
            {Math.round(
              (Date.now() - riskScore.lastUpdated.getTime()) / (60 * 60 * 1000)
            )}{' '}
            hours ago
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
