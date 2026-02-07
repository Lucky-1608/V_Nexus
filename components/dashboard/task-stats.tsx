import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { HoverEffect } from '@/components/ui/hover-effect'
import Link from 'next/link'

export async function TaskStats({ userId }: { userId: string }) {
    const supabase = await createClient()

    const now = new Date()
    const startOfDay = new Date(now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }))
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setHours(23, 59, 59, 999)

    const startOfDayISO = startOfDay.toISOString()
    const endOfDayISO = endOfDay.toISOString()

    const { count: tasksPending } = await supabase.from('tasks')
        .select('*', { count: 'exact', head: true })
        .or(`assigned_to.eq.${userId},and(assigned_to.is.null,user_id.eq.${userId})`)
        .neq('status', 'Done')
        .or(`due_date.lte.${endOfDayISO},due_date.is.null`)

    const { count: tasksDone } = await supabase.from('tasks')
        .select('*', { count: 'exact', head: true })
        .or(`assigned_to.eq.${userId},and(assigned_to.is.null,user_id.eq.${userId})`)
        .eq('status', 'Done')
        .gte('completed_at', startOfDayISO)
        .lte('completed_at', endOfDayISO)

    const totalTasks = (tasksDone || 0) + (tasksPending || 0)
    const completionRate = totalTasks > 0 ? ((tasksDone || 0) / totalTasks) * 100 : 0

    return (
        <HoverEffect variant="lift" className="h-full">
            <Link href="/dashboard/tasks" className="block h-full">
                <SpotlightCard className="h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-semibold">Tasks</CardTitle>
                        <CheckSquare className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tighter text-blue-500 dark:text-blue-400">
                            {tasksDone || 0} <span className="text-muted-foreground text-2xl font-normal">/ {totalTasks}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Stay focused and get things done.</p>
                        <Progress value={completionRate} className="h-2 mt-4 bg-blue-100 dark:bg-blue-900/30" />
                    </CardContent>
                </SpotlightCard>
            </Link>
        </HoverEffect>
    )
}
