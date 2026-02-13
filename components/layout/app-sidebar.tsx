'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Building2,
  ChevronDown,
  Home,
  Menu,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DashboardTier } from '@/lib/types'

interface AppSidebarProps {
  isCollapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function AppSidebar({ isCollapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname()
  const [currentTier, setCurrentTier] = useState<DashboardTier>('consumer')
  const [tierOpen, setTierOpen] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Update current tier based on pathname
    if (pathname.includes('/analyst')) setCurrentTier('analyst')
    else if (pathname.includes('/institution')) setCurrentTier('institution')
    else if (pathname.includes('/consumer')) setCurrentTier('consumer')
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const tierConfig: Record<
    DashboardTier,
    { label: string; icon: React.ReactNode; path: string; color: string }
  > = {
    consumer: {
      label: 'Consumer Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard/consumer',
      color: 'emerald',
    },
    institution: {
      label: 'Institution Portal',
      icon: <Building2 className="h-5 w-5" />,
      path: '/dashboard/institution',
      color: 'blue',
    },
    analyst: {
      label: 'Analyst Workbench',
      icon: <TrendingUp className="h-5 w-5" />,
      path: '/dashboard/analyst',
      color: 'purple',
    },
  }

  const navItems = [
    {
      label: 'Overview',
      icon: <BarChart3 className="h-5 w-5" />,
      href: tierConfig[currentTier].path,
    },
    {
      label: 'Alerts',
      icon: <Shield className="h-5 w-5" />,
      href: `${tierConfig[currentTier].path}/alerts`,
    },
  ]

  const handleTierChange = (tier: DashboardTier) => {
    setCurrentTier(tier)
  }

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-sidebar-border p-4">
        <div
          className={cn(
            'flex items-center gap-2.5 font-semibold text-sidebar-foreground',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && <span className="text-sm">FinGuard AI</span>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onCollapsedChange(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Tier Selector */}
      <div className="border-b border-sidebar-border p-3">
        <button
          onClick={() => setTierOpen(!tierOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-md p-2 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          {!isCollapsed && <span>Dashboard Tier</span>}
          {!isCollapsed && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                tierOpen && 'rotate-180'
              )}
            />
          )}
        </button>

        {tierOpen && !isCollapsed && isClient && (
          <div className="mt-2 space-y-1">
            {(Object.keys(tierConfig) as DashboardTier[]).map((tier) => (
              <Link
                key={tier}
                href={tierConfig[tier].path}
                onClick={() => handleTierChange(tier)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                  currentTier === tier
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
                )}
              >
                {tierConfig[tier].icon}
                <span>{tierConfig[tier].label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive(item.href)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50',
              isCollapsed && 'justify-center'
            )}
            title={isCollapsed ? item.label : ''}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            'flex items-center gap-2 rounded-md bg-sidebar-accent/50 p-2',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/30 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
            FG
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-xs">
              <div className="font-medium text-sidebar-foreground">User</div>
              <div className="text-sidebar-foreground/60">user@example.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
