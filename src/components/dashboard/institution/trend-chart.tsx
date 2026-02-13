'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendDataPoint } from '@/lib/types'

interface TrendChartProps {
  data: TrendDataPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
          <p className="text-foreground font-medium">{payload[0].payload.date}</p>
          <p className="text-primary font-semibold">Risk: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Risk Score Trend</CardTitle>
        <CardDescription>90-day average risk score progression</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
