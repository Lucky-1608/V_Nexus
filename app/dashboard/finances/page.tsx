import { createClient } from '@/lib/supabase/server'
import { FinancesManager } from '@/components/finances/finances-manager'

export default async function FinancesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please log in</div>

    const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError)
    }

    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

    if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
    }

    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('name', { ascending: true })

    if (projectsError) {
        console.error('Error fetching projects:', projectsError)
    }

    return (
        <FinancesManager
            initialTransactions={transactions || []}
            categories={categories || []}
            projects={projects || []}
        />
    )
}
