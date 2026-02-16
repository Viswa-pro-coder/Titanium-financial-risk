'use client'

import { useState } from 'react'
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react'
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
import { Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TransactionsTableProps {
  transactions: Transaction[]
}

type SortBy = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue, bValue

    if (sortBy === 'date') {
      aValue = new Date(a.date).getTime()
      bValue = new Date(b.date).getTime()
    } else {
      aValue = a.amount
      bValue = b.amount
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      shopping: 'bg-blue-500/10 text-blue-700',
      dining: 'bg-orange-500/10 text-orange-700',
      transportation: 'bg-purple-500/10 text-purple-700',
      utilities: 'bg-slate-500/10 text-slate-700',
      healthcare: 'bg-rose-500/10 text-rose-700',
      entertainment: 'bg-pink-500/10 text-pink-700',
      savings: 'bg-emerald-500/10 text-emerald-700',
      other: 'bg-gray-500/10 text-gray-700',
    }
    return colors[category] || colors.other
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-32 cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">
                    Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Category</TableHead>
                <TableHead className="w-24 text-right cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    {sortBy === 'amount' && (
                      sortOrder === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {transaction.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.merchantName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize text-xs font-medium border-0',
                        getCategoryColor(transaction.category)
                      )}
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    -₹{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.riskFlag && (
                      <div className="flex justify-center" title="Unusual transaction">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
