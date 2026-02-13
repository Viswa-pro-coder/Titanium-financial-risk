/* FinGuard AI - Type Definitions */

export type DashboardTier = 'consumer' | 'institution' | 'analyst'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertType = 'predictive' | 'fraud' | 'compliance'
export type TransactionCategory = 'shopping' | 'dining' | 'transportation' | 'utilities' | 'healthcare' | 'entertainment' | 'savings' | 'other'
export type TrendDirection = 'up' | 'down' | 'stable'

/* Risk Score */
export interface RiskScore {
  value: number
  trend: TrendDirection
  lastUpdated: Date
  label: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk'
  riskLevel: RiskLevel
}

/* Financial Metrics */
export interface FinancialMetrics {
  monthlySpending: number
  monthlyIncome: number
  daysToPayday: number
  emergencyFundStatus: number // percentage 0-100
  savingsGoal: number
  savingsProgress: number
}

/* Transaction */
export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  category: TransactionCategory
  riskFlag?: boolean
  merchantName: string
}

/* Alert */
export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  type: AlertType
  timestamp: Date
  acknowledged?: boolean
  actionUrl?: string
}

/* Spending Category Data */
export interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  color: string
}

/* Customer (B2B/Analyst) */
export interface Customer {
  id: string
  name: string
  initials: string
  riskScore: number
  riskLevel: RiskLevel
  riskTrend: TrendDirection
  lastContactDate: Date
  segment: string
  alertCount: number
  status: 'active' | 'inactive' | 'at-risk'
}

/* KPI Metric */
export interface KPIMetric {
  label: string
  value: number | string
  change?: number
  unit?: string
  trend?: TrendDirection
}

/* Dashboard State */
export interface DashboardState {
  currentTier: DashboardTier
  isCollapsed: boolean
  theme: 'dark' | 'light'
  notifications: Alert[]
  unreadCount: number
}

/* Trend Data Point */
export interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

/* Heatmap Cell */
export interface HeatmapCell {
  id: string
  risk: number
  segment: string
  count: number
  trend: TrendDirection
}

/* Kanban Card */
export interface KanbanCard {
  id: string
  clientName: string
  initials: string
  riskScore: number
  riskTrend: TrendDirection
  lastContact: Date
  revenue: number
}

/* Batch Upload */
export interface BatchUploadFile {
  id: string
  name: string
  size: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  recordsCount?: number
}

/* Report Template */
export interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'assessment' | 'planning' | 'analysis'
}

/* Chat Message */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: string[]
}

/* User Profile */
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  tier: DashboardTier
  organization?: string
  role?: string
}
