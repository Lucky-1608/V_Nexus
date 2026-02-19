import { getUserTeams } from '../dashboard/chat/queries'
import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userId = user?.id

    if (!userId) {
        // Fallback for debug: get first user from DB
        const { data: users } = await supabase.from('users').select('id').limit(1)
        if (users && users.length > 0) {
            userId = users[0].id
        }
    }

    if (!userId) {
        return <div>No users found in database and not logged in.</div>
    }

    const teams = await getUserTeams(userId)

    // Also fetch raw projects without the complex query to compare
    const { data: rawProjects, error } = await supabase
        .from('projects')
        .select('*')

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Debug Projects</h1>

            <section>
                <h2 className="text-xl font-semibold">User ID: {userId}</h2>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Formatted Teams (from getUserTeams)</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(teams, null, 2)}
                </pre>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Raw Projects (Direct Fetch)</h2>
                {error ? (
                    <div className="text-red-500">Error: {error.message}</div>
                ) : (
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(rawProjects, null, 2)}
                    </pre>
                )}
            </section>
        </div>
    )
}
