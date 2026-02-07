import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { HoverEffect } from '@/components/ui/hover-effect'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export async function FinanceStats({ userId }: { userId: string }) {
    const supabase = await createClient()

    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', userId)

    const income = transactions?.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0) || 0
    const expense = transactions?.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0) || 0
    const balance = income - expense

    return (
        <HoverEffect variant="lift" className="h-full">
            <Link href="/dashboard/finances" className="block h-full">
                <SpotlightCard className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Net Balance</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <div className={`text-3xl font-bold tracking-tighter ${balance >= 0 ? 'text-foreground' : 'text-red-600'}`}>
                                {formatCurrency(balance)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Total liquid assets available</p>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="flex items-center justify-end text-sm text-green-600 bg-green-500/10 px-2 py-1 rounded-md">
                                <ArrowUpRight className="h-3 w-3 mr-1" />{formatCurrency(income)}
                            </span>
                            <span className="flex items-center justify-end text-sm text-red-600 bg-red-500/10 px-2 py-1 rounded-md">
                                <ArrowDownLeft className="h-3 w-3 mr-1" />{formatCurrency(expense)}
                            </span>
                        </div>
                    </CardContent>
                </SpotlightCard>
            </Link>
        </HoverEffect>
    )
}
