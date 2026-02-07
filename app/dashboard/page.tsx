import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DateTimeDisplay } from '@/components/date-time-display'
import { MagneticText } from '@/components/ui/magnetic-text'
import { StaggerContainer, StaggerItem } from '@/components/ui/entrance'
import { HabitStats } from '@/components/dashboard/habit-stats'
import { TaskStats } from '@/components/dashboard/task-stats'
import { GoalStats } from '@/components/dashboard/goal-stats'
import { FinanceStats } from '@/components/dashboard/finance-stats'
import { ResourceStats } from '@/components/dashboard/resource-stats'
import { QuickLinks } from '@/components/dashboard/quick-links'
import { StatsSkeleton, QuickLinksSkeleton } from '@/components/dashboard/skeletons'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <MagneticText>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    </MagneticText>
                    <p className="text-muted-foreground">Overview of your productivity & finances.</p>
                </div>
                <DateTimeDisplay />
            </div>

            {/* Main Stats Bento Grid */}
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" delay={0.1}>
                {/* Daily Habits - Large Feature Card */}
                <StaggerItem className="lg:col-span-2">
                    <Suspense fallback={<StatsSkeleton />}>
                        <HabitStats userId={user.id} />
                    </Suspense>
                </StaggerItem>

                <StaggerItem className="lg:col-span-2">
                    <Suspense fallback={<StatsSkeleton />}>
                        <TaskStats userId={user.id} />
                    </Suspense>
                </StaggerItem>

                <StaggerItem>
                    <Suspense fallback={<StatsSkeleton />}>
                        <GoalStats userId={user.id} />
                    </Suspense>
                </StaggerItem>

                <StaggerItem className="lg:col-span-2 md:col-span-2">
                    <Suspense fallback={<StatsSkeleton />}>
                        <FinanceStats userId={user.id} />
                    </Suspense>
                </StaggerItem>

                <StaggerItem className="lg:col-span-2">
                    <Suspense fallback={<div className="grid grid-cols-2 gap-4 h-full"><StatsSkeleton /><StatsSkeleton /></div>}>
                        <ResourceStats userId={user.id} />
                    </Suspense>
                </StaggerItem>
            </StaggerContainer>

            {/* Quick Links Bento - Asymmetrical */}
            <Suspense fallback={<QuickLinksSkeleton />}>
                <QuickLinks userId={user.id} />
            </Suspense>
        </div>
    )
}

