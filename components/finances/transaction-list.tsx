'use client'

import { useState, useMemo, useEffect } from 'react'
import { format, startOfDay, endOfDay, subMonths, isSameMonth, isWithinInterval } from 'date-fns'
import { ArrowDownLeft, ArrowUpRight, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteTransaction } from '@/app/dashboard/finances/actions'
import { EditTransactionDialog } from '@/components/finances/edit-transaction-dialog'
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog'
import { StaggerContainer, StaggerItem } from '@/components/ui/entrance'
import { cn, formatCurrency } from '@/lib/utils'
import { HoverEffect } from '@/components/ui/hover-effect'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Transaction {
    id: string
    type: 'Income' | 'Expense' | string
    amount: number
    category_name: string
    description?: string
    date: string
    project_id?: string | null
}

interface Category {
    id: string
    name: string
    type: 'Income' | 'Expense'
    user_id: string
}

interface Project {
    id: string
    name: string
}

export function TransactionList({ transactions, categories, projects }: { transactions: Transaction[], categories: Category[], projects: Project[] }) {
    const [filterType, setFilterType] = useState<'all' | 'month' | 'range'>('all')
    const [selectedMonth, setSelectedMonth] = useState<string>("")
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [isMounted, setIsMounted] = useState(false)

    // Initialize dates on client side to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true)
        setSelectedMonth(format(new Date(), 'yyyy-MM'))
        setDateRange({
            from: subMonths(new Date(), 1),
            to: new Date(),
        })
    }, [])

    const filteredTransactions = useMemo(() => {
        if (!isMounted) return transactions

        return transactions.filter(t => {
            const tDate = new Date(t.date)
            if (filterType === 'month') {
                if (!selectedMonth) return true
                return isSameMonth(tDate, new Date(selectedMonth))
            }
            if (filterType === 'range' && dateRange?.from) {
                const start = startOfDay(dateRange.from)
                const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from)
                return isWithinInterval(tDate, { start, end })
            }
            return true
        })
    }, [transactions, filterType, selectedMonth, dateRange, isMounted])

    // Generate last 12 months for select
    const months = useMemo(() => {
        const result = []
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), i)
            result.push({
                value: format(date, 'yyyy-MM'),
                label: format(date, 'MMMM yyyy')
            })
        }
        return result
    }, [])

    return (
        <SpotlightCard className="col-span-3">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle>Transactions</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                    <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="w-auto">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="range">Range</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {filterType === 'month' && (
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(month => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {filterType === 'range' && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const from = e.target.value ? new Date(e.target.value) : undefined
                                    setDateRange(prev => ({ to: prev?.to, from }))
                                }}
                                className="w-[140px]"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="date"
                                value={dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const to = e.target.value ? new Date(e.target.value) : undefined
                                    setDateRange(prev => ({ from: prev?.from, to }))
                                }}
                                className="w-[140px]"
                            />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <ScrollArea className="h-[500px]">
                        <StaggerContainer className="space-y-4 pr-4">
                            {filteredTransactions.map((t) => (
                                <StaggerItem key={t.id} className="w-full">
                                    <HoverEffect variant="scale" className="rounded-lg">
                                        <div
                                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 p-2"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className={cn(
                                                        "flex h-9 w-9 items-center justify-center rounded-full border",
                                                        t.type === 'Income' ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                                                    )}
                                                >
                                                    {t.type === 'Income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{t.category_name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {format(new Date(t.date), 'MMM d, yyyy h:mm a')}{t.description ? ` • ${t.description}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={cn("font-medium", t.type === 'Income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                                                    {t.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                                                </div>
                                                <EditTransactionDialog transaction={t} categories={categories} projects={projects} />
                                                <ConfirmDeleteDialog
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                    onConfirm={() => deleteTransaction(t.id)}
                                                    title="Delete Transaction"
                                                    description="Are you sure you want to delete this transaction? This action cannot be undone."
                                                />
                                            </div>
                                        </div>
                                    </HoverEffect>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </ScrollArea>
                    {filteredTransactions.length === 0 && <p className="text-muted-foreground text-sm">No transactions found for the selected period.</p>}
                </div>
            </CardContent>
        </SpotlightCard>
    )
}
