'use client'

import { Search, BookOpen, FileText, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ResearchPanel() {
  const resources = [
    {
      title: 'Financial Risk Assessment Guide',
      type: 'Documentation',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: 'Industry Trends Q1 2024',
      type: 'Report',
      icon: BookOpen,
      color: 'text-purple-500',
    },
    {
      title: 'Regulatory Compliance Updates',
      type: 'Link',
      icon: LinkIcon,
      color: 'text-emerald-500',
    },
  ]

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg">Research & Resources</CardTitle>
        <CardDescription>Quick access to key information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9 bg-secondary border-border text-sm h-8"
          />
        </div>

        {/* Resources List */}
        <div className="space-y-3">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <div
                key={index}
                className="p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', resource.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {resource.type}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-3">
          <Button variant="outline" className="w-full text-xs h-8">
            Browse All Resources
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
