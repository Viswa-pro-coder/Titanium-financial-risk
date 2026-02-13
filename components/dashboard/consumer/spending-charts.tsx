'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { SpendingCategory, TrendDataPoint } from '@/lib/types'

interface SpendingChartsProps {
  spendingByCategory: SpendingCategory[]
  spendingTrend: TrendDataPoint[]
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#a78bfa', '#06b6d4', '#ef4444', '#6b7280']

export function SpendingCharts({
  spendingByCategory,
  spendingTrend,
}: SpendingChartsProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
          <p className="text-foreground font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  const TrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
          <p className="text-foreground font-medium">{payload[0].payload.date}</p>
          <p className="text-primary font-semibold">${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
          <CardDescription>Last 30 days breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="amount"
                label={({ name, percentage }) => `${name} ${percentage}%`}
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {spendingByCategory.map((category, index) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{category.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Area Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Spending Trend</CardTitle>
          <CardDescription>Last 30 days daily spending</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendingTrend}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
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
              />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSpending)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
