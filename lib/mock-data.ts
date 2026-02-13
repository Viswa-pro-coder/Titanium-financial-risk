import {
  Alert,
  Transaction,
  Customer,
  TrendDataPoint,
  HeatmapCell,
  KanbanCard,
  ReportTemplate,
} from './types'

/* B2C Consumer Data */
export const consumerRiskScore = {
  value: 42,
  trend: 'stable' as const,
  lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
  label: 'Moderate Risk' as const,
  riskLevel: 'medium' as const,
}

export const consumerMetrics = {
  monthlySpending: 4250,
  monthlyIncome: 5800,
  daysToPayday: 12,
  emergencyFundStatus: 65,
  savingsGoal: 15000,
  savingsProgress: 9850,
}

export const consumerTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-02-12'),
    description: 'Whole Foods Market',
    amount: 142.50,
    category: 'shopping',
    merchantName: 'Whole Foods',
    riskFlag: false,
  },
  {
    id: '2',
    date: new Date('2024-02-11'),
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'entertainment',
    merchantName: 'Netflix',
    riskFlag: false,
  },
  {
    id: '3',
    date: new Date('2024-02-11'),
    description: 'Uber Trip',
    amount: 28.45,
    category: 'transportation',
    merchantName: 'Uber',
    riskFlag: false,
  },
  {
    id: '4',
    date: new Date('2024-02-10'),
    description: 'Amazon Purchase',
    amount: 89.99,
    category: 'shopping',
    merchantName: 'Amazon',
    riskFlag: false,
  },
  {
    id: '5',
    date: new Date('2024-02-10'),
    description: 'Medical Clinic Visit',
    amount: 150.00,
    category: 'healthcare',
    merchantName: 'City Medical',
    riskFlag: false,
  },
]

export const consumerAlerts: Alert[] = [
  {
    id: '1',
    title: 'Unusual spending detected',
    description: 'Electronics purchase exceeds typical pattern by 180%',
    severity: 'medium',
    type: 'predictive',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    acknowledged: false,
  },
  {
    id: '2',
    title: 'Emergency fund low',
    description: 'Your emergency savings is below recommended 6-month threshold',
    severity: 'high',
    type: 'predictive',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    acknowledged: false,
  },
  {
    id: '3',
    title: 'Payment reminder',
    description: 'Credit card payment due in 5 days',
    severity: 'low',
    type: 'compliance',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    acknowledged: true,
  },
]

export const consumerSpendingByCategory = [
  { name: 'Housing', amount: 1500, percentage: 35, color: '#10b981' },
  { name: 'Food & Dining', amount: 620, percentage: 15, color: '#f59e0b' },
  { name: 'Transportation', amount: 350, percentage: 8, color: '#3b82f6' },
  { name: 'Entertainment', amount: 280, percentage: 7, color: '#a78bfa' },
  { name: 'Utilities', amount: 250, percentage: 6, color: '#06b6d4' },
  { name: 'Healthcare', amount: 210, percentage: 5, color: '#ef4444' },
  { name: 'Other', amount: 640, percentage: 15, color: '#6b7280' },
]

export const consumerSpendingTrend: TrendDataPoint[] = [
  { date: '1 Dec', value: 3800 },
  { date: '5 Dec', value: 4100 },
  { date: '10 Dec', value: 3950 },
  { date: '15 Dec', value: 4300 },
  { date: '20 Dec', value: 4600 },
  { date: '25 Dec', value: 5200 },
  { date: '30 Dec', value: 4800 },
  { date: '5 Jan', value: 4100 },
  { date: '10 Jan', value: 3900 },
  { date: '15 Jan', value: 4250 },
  { date: '20 Jan', value: 4500 },
  { date: '25 Jan', value: 4200 },
  { date: '1 Feb', value: 4100 },
  { date: '5 Feb', value: 4350 },
]

/* B2B Institution Data */
export const institutionKPIs = [
  {
    label: 'Total Customers',
    value: '12,450',
    change: 12,
    trend: 'up' as const,
  },
  {
    label: 'Avg Risk Score',
    value: '38',
    change: -5,
    trend: 'down' as const,
  },
  {
    label: 'Critical Cases',
    value: '142',
    change: 8,
    trend: 'up' as const,
  },
  {
    label: 'Compliance Rate',
    value: '94.2%',
    change: 2,
    trend: 'up' as const,
  },
]

export const institutionTrendData: TrendDataPoint[] = [
  { date: 'Dec 1', value: 42 },
  { date: 'Dec 8', value: 41 },
  { date: 'Dec 15', value: 43 },
  { date: 'Dec 22', value: 40 },
  { date: 'Dec 29', value: 39 },
  { date: 'Jan 5', value: 38 },
  { date: 'Jan 12', value: 37 },
  { date: 'Jan 19', value: 38 },
  { date: 'Jan 26', value: 39 },
  { date: 'Feb 2', value: 38 },
  { date: 'Feb 9', value: 37 },
]

export const institutionAlerts: Alert[] = [
  {
    id: '1',
    title: 'High-risk customer profile detected',
    description: 'Customer #4521 shows 5 risk indicators',
    severity: 'critical',
    type: 'fraud',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    acknowledged: false,
  },
  {
    id: '2',
    title: 'Compliance policy update',
    description: 'New KYC requirements effective immediately',
    severity: 'high',
    type: 'compliance',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    acknowledged: false,
  },
  {
    id: '3',
    title: 'Batch processing complete',
    description: '5,240 records processed successfully',
    severity: 'low',
    type: 'predictive',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    acknowledged: true,
  },
]

export const institutionHeatmapData: HeatmapCell[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: `cell-${i}`,
    risk: Math.floor(Math.random() * 100),
    segment: `Segment ${Math.floor(i / 10) + 1}`,
    count: Math.floor(Math.random() * 500) + 50,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
  })
)

export const institutionRiskByDemographic = [
  { name: 'Age 18-25', value: 52, color: '#ef4444' },
  { name: 'Age 26-35', value: 38, color: '#f59e0b' },
  { name: 'Age 36-50', value: 31, color: '#eab308' },
  { name: 'Age 51-65', value: 25, color: '#84cc16' },
  { name: 'Age 65+', value: 28, color: '#10b981' },
]

/* B2Pro Analyst Data */
export const analystKanbanCards: Record<string, KanbanCard[]> = {
  low: [
    {
      id: 'card-1',
      clientName: 'Acme Corp',
      initials: 'AC',
      riskScore: 15,
      riskTrend: 'down',
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      revenue: 125000,
    },
    {
      id: 'card-2',
      clientName: 'TechStart Inc',
      initials: 'TI',
      riskScore: 12,
      riskTrend: 'stable',
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      revenue: 95000,
    },
  ],
  medium: [
    {
      id: 'card-3',
      clientName: 'Global Solutions',
      initials: 'GS',
      riskScore: 45,
      riskTrend: 'up',
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      revenue: 280000,
    },
    {
      id: 'card-4',
      clientName: 'Finance Plus',
      initials: 'FP',
      riskScore: 38,
      riskTrend: 'stable',
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      revenue: 165000,
    },
  ],
  high: [
    {
      id: 'card-5',
      clientName: 'Growth Ventures',
      initials: 'GV',
      riskScore: 72,
      riskTrend: 'up',
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      revenue: 420000,
    },
  ],
  critical: [
    {
      id: 'card-6',
      clientName: 'Red Flag Ltd',
      initials: 'RF',
      riskScore: 88,
      riskTrend: 'up',
      lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      revenue: 350000,
    },
  ],
}

export const analystQuickStats = [
  { label: 'Active Clients', value: '24', change: 3, trend: 'up' as const },
  {
    label: 'Critical Cases',
    value: '8',
    change: -2,
    trend: 'down' as const,
  },
  {
    label: 'Avg Risk Score',
    value: '42',
    change: 5,
    trend: 'up' as const,
  },
  {
    label: 'Monthly Revenue',
    value: '$2.3M',
    change: 12,
    trend: 'up' as const,
  },
]

export const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Financial Health Report',
    description: 'Comprehensive analysis of financial wellbeing',
    icon: 'TrendingUp',
    category: 'assessment',
  },
  {
    id: '2',
    name: 'Risk Assessment',
    description: 'Detailed risk profile and mitigation strategies',
    icon: 'AlertTriangle',
    category: 'assessment',
  },
  {
    id: '3',
    name: 'Intervention Plan',
    description: 'Customized action plan for risk reduction',
    icon: 'Target',
    category: 'planning',
  },
  {
    id: '4',
    name: 'Comparative Analysis',
    description: 'Benchmark against industry standards',
    icon: 'BarChart3',
    category: 'analysis',
  },
]

export const allCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'John Smith',
    initials: 'JS',
    riskScore: 35,
    riskLevel: 'low',
    riskTrend: 'down',
    lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    segment: 'High Value',
    alertCount: 0,
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Sarah Johnson',
    initials: 'SJ',
    riskScore: 52,
    riskLevel: 'medium',
    riskTrend: 'up',
    lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    segment: 'Standard',
    alertCount: 2,
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Michael Chen',
    initials: 'MC',
    riskScore: 68,
    riskLevel: 'high',
    riskTrend: 'stable',
    lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    segment: 'Watch List',
    alertCount: 4,
    status: 'at-risk',
  },
  {
    id: 'c4',
    name: 'Emma Davis',
    initials: 'ED',
    riskScore: 28,
    riskLevel: 'low',
    riskTrend: 'down',
    lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    segment: 'High Value',
    alertCount: 0,
    status: 'active',
  },
  {
    id: 'c5',
    name: 'David Wilson',
    initials: 'DW',
    riskScore: 85,
    riskLevel: 'critical',
    riskTrend: 'up',
    lastContactDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    segment: 'Critical',
    alertCount: 6,
    status: 'at-risk',
  },
]
