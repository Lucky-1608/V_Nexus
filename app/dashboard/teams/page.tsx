import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
import { Users, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CreateTeamDialog } from '@/components/chat/CreateTeamDialog'

export default async function TeamsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user's teams
    const { data: teamMembers } = await supabase
        .from('team_members')
        .select(`
            team_id,
            role,
            teams (
                id,
                name,
                created_at,
                created_by
            )
        `)
        .eq('user_id', user.id)

    const teams = teamMembers?.map(tm => ({
        ...tm.teams,
        role: tm.role
    })) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teams Dashboard</h2>
                    <p className="text-muted-foreground">Manage your teams and collaborations.</p>
                </div>
                <CreateTeamDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team: any) => (
                    <SpotlightCard
                        key={team.id}
                        className="flex flex-col group/card transition-all duration-300 hover:shadow-xl hover:border-primary/40"
                        contentClassName="bg-card/20 backdrop-blur-xl border-border/50 saturate-150"
                    >
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="h-5 w-5 text-primary" />
                                {team.name}
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Role: <span className="capitalize font-medium text-foreground">{team.role}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 px-0 py-2">
                            {/* Add member counts or other stats if available in future */}
                            <p className="text-sm text-muted-foreground">
                                Joined {new Date(team.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </CardContent>
                        <CardFooter className="px-0 pb-0 pt-4 mt-auto border-t border-border/50">
                            <Button asChild className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-0" variant="outline">
                                <Link href={`/dashboard/chat/${team.id}`}>
                                    Open Chat
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </SpotlightCard>
                ))}

                {teams.length === 0 && (
                    <SpotlightCard
                        className="col-span-full group/card"
                        contentClassName="border-dashed p-8 text-center flex flex-col items-center justify-center gap-4 text-muted-foreground bg-card/10 backdrop-blur-md border-border/50"
                    >
                        <div className="p-4 rounded-full bg-primary/10 mb-2">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">No teams yet</h3>
                            <p>Create a team to start collaborating with others.</p>
                        </div>
                        <CreateTeamDialog />
                    </SpotlightCard>
                )}
            </div>
        </div>
    )
}
