import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUserTeams(debugUserId?: string) {
    const supabase = await createClient()

    let user;
    if (debugUserId) {
        user = { id: debugUserId }
    } else {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
    }

    if (!user) redirect('/login')

    // Fetch teams the user belongs to
    const { data: teams, error } = await supabase
        .from('teams')
        .select(`
            id,
            name,
            team_members (
                role,
                user_id
            ),
            projects (
                id,
                name,
                team_id,
                created_by,
                project_members (
                    user_id
                )
            )
        `)
        .order('name')

    if (error) {
        console.error("Error fetching teams:", JSON.stringify(error, null, 2))
        return []
    }

    // Transform data
    const formattedTeams = teams?.map(team => {
        // Find current user's role
        const userMember = team.team_members?.find(m => m.user_id === user.id)
        const teamRole = userMember?.role || 'member'

        // Filter projects: 
        // Show if:
        // 1. User is Team Owner or Admin
        // 2. User is the Project Creator
        // 3. User is in project_members
        // 4. Project has NO members (Legacy/Public fallback)
        const visibleProjects = Array.isArray(team.projects)
            ? team.projects.filter(p => {
                // Team Owners and Admins see all
                if (teamRole === 'owner' || teamRole === 'admin') return true

                // Creator sees their project
                if (p.created_by === user.id) return true

                const members = p.project_members || []
                if (members.length === 0) return true // Legacy/Public fallback

                // Members see project
                return members.some((pm: any) => pm.user_id === user.id)
            })
            : []

        return {
            ...team,
            currentUserRole: teamRole,
            projects: visibleProjects.sort((a, b) => a.name.localeCompare(b.name))
        }
    }) || []

    return formattedTeams
}
