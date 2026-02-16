'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AlertsCenterProps {
  alerts: Alert[]
  onAcknowledge?: (id: string) => void
}

export function AlertsCenter({ alerts, onAcknowledge }: AlertsCenterProps) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(
    new Set(alerts.filter((a) => a.acknowledged).map((a) => a.id))
  )

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    onAcknowledge?.(id)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />
      case 'high':
        return <AlertCircle className="h-5 w-5" />
      case 'medium':
        return <Info className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-700'
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-700'
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-700'
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-700'
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-700 border-rose-500/50'
      case 'high':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/50'
      case 'medium':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/50'
      default:
        return 'bg-blue-500/20 text-blue-700 border-blue-500/50'
    }
  }

  const unacknowledgedAlerts = alerts.filter((a) => !acknowledgedAlerts.has(a.id))

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
        <CardDescription>
          {unacknowledgedAlerts.length > 0
            ? `${unacknowledgedAlerts.length} active alert${unacknowledgedAlerts.length !== 1 ? 's' : ''}`
            : 'No active alerts'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All systems normal</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isAcknowledged = acknowledgedAlerts.has(alert.id)
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'border rounded-lg p-3 transition-opacity',
                    isAcknowledged && 'opacity-50',
                    getSeverityColor(alert.severity)
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <p className="text-xs opacity-90 mt-1">
                            {alert.description}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize text-xs font-medium whitespace-nowrap',
                            getSeverityBadgeColor(alert.severity)
                          )}
                        >
                          {alert.severity}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-75">
                          {Math.round(
                            (Date.now() - alert.timestamp.getTime()) /
                            (60 * 60 * 1000)
                          )}{' '}
                          hours ago
                        </span>

                        {!isAcknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}

                        {isAcknowledged && (
                          <span className="text-xs opacity-60 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
