'use client'

import { useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AlertsTableProps {
  alerts: Alert[]
}

type FilterType = 'all' | 'critical' | 'high' | 'unacknowledged'

export function AlertsTable({ alerts }: AlertsTableProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(
    new Set(alerts.filter((a) => a.acknowledged).map((a) => a.id))
  )

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'critical') return alert.severity === 'critical'
    if (filter === 'high') return alert.severity === 'high' || alert.severity === 'critical'
    if (filter === 'unacknowledged') return !acknowledgedIds.has(alert.id)
    return true
  })

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-700'
      case 'high':
        return 'bg-orange-500/10 text-orange-700'
      case 'medium':
        return 'bg-amber-500/10 text-amber-700'
      default:
        return 'bg-blue-500/10 text-blue-700'
    }
  }

  const getSeverityBadge = (severity: string) => {
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

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <CardDescription>
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} to review
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {(['all', 'critical', 'high', 'unacknowledged'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Alert</TableHead>
                <TableHead className="w-24">Severity</TableHead>
                <TableHead className="w-20">Type</TableHead>
                <TableHead className="w-32">Time</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No alerts match this filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => {
                  const isAcknowledged = acknowledgedIds.has(alert.id)
                  return (
                    <TableRow
                      key={alert.id}
                      className={cn(
                        'border-border hover:bg-secondary/30 transition-colors',
                        isAcknowledged && 'opacity-50'
                      )}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize text-xs font-medium border-0',
                            getSeverityBadge(alert.severity)
                          )}
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {alert.type}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Math.round(
                            (Date.now() - alert.timestamp.getTime()) / (60 * 1000)
                          )}{' '}
                          min ago
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {isAcknowledged ? (
                          <div className="flex items-center justify-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs">Done</span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
