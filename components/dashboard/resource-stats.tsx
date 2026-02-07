import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Library, StickyNote } from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { HoverEffect } from '@/components/ui/hover-effect'
import Link from 'next/link'

export async function ResourceStats({ userId }: { userId: string }) {
    const supabase = await createClient()

    // We execute these in parallel as they are independent but related in this widget
    const [resourcesRes, notesRes] = await Promise.all([
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ])

    const resourcesCount = resourcesRes.count || 0
    const notesCount = notesRes.count || 0

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <HoverEffect variant="lift" className="h-full">
                <Link href="/dashboard/resources" className="block h-full">
                    <SpotlightCard className="h-full flex flex-col justify-center items-center text-center p-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                            <Library className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{resourcesCount}</div>
                        <p className="text-xs text-muted-foreground">Resources</p>
                    </SpotlightCard>
                </Link>
            </HoverEffect>
            <HoverEffect variant="lift" className="h-full">
                <Link href="/dashboard/notes" className="block h-full">
                    <SpotlightCard className="h-full flex flex-col justify-center items-center text-center p-4">
                        <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                            <StickyNote className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="text-2xl font-bold">{notesCount}</div>
                        <p className="text-xs text-muted-foreground">Notes</p>
                    </SpotlightCard>
                </Link>
            </HoverEffect>
        </div>
    )
}
