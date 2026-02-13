'use client'

import {
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  FileText,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReportTemplate } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ReportTemplatesProps {
  templates: ReportTemplate[]
}

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
}

export function ReportTemplates({ templates }: ReportTemplatesProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assessment':
        return 'bg-blue-500/10 text-blue-700'
      case 'planning':
        return 'bg-purple-500/10 text-purple-700'
      case 'analysis':
        return 'bg-emerald-500/10 text-emerald-700'
      default:
        return 'bg-gray-500/10 text-gray-700'
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Report Templates</CardTitle>
        <CardDescription>Pre-built templates for quick report generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {ICON_MAP[template.icon] || (
                    <FileText className="h-6 w-6 text-primary" />
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'capitalize text-xs font-medium border-0',
                    getCategoryColor(template.category)
                  )}
                >
                  {template.category}
                </Badge>
              </div>

              <h3 className="font-semibold text-foreground mb-1">
                {template.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {template.description}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Download template"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
