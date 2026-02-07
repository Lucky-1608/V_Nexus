import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { HoverEffect } from '@/components/ui/hover-effect'
import Link from 'next/link'

export async function GoalStats({ userId }: { userId: string }) {
    const supabase = await createClient()

    const { data: goalsVector } = await supabase
        .from('goals')
        .select('current_value, target_value')
        .eq('user_id', userId)

    let avgProgress = 0
    if (goalsVector && goalsVector.length > 0) {
        const totalProgress = goalsVector.reduce((acc, g) => acc + Math.min((g.current_value / g.target_value) * 100, 100), 0)
        avgProgress = totalProgress / goalsVector.length
    }

    return (
        <HoverEffect variant="lift">
            <Link href="/dashboard/goals" className="block h-full">
                <SpotlightCard className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgProgress.toFixed(0)}%</div>
                        <Progress value={avgProgress} className="h-1.5 mt-2" />
                    </CardContent>
                </SpotlightCard>
            </Link>
        </HoverEffect>
    )
}
