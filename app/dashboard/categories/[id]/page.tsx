import { createClient } from '@/lib/supabase/server'
import { ResourceCard, ResourceProps } from '@/components/resource-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { TransactionList } from '@/components/finances/transaction-list'

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (!category) {
        return <div>Category not found</div>
    }

    // Check if it's a finance category
    const isFinance = category.type === 'Income' || category.type === 'Expense' || category.type === 'Finance'

    let resources = []
    let transactions = []
    let allCategories = []
    let allProjects = []

    if (isFinance) {
        // Fetch transactions for this category
        const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .eq('category_id', id)
            .order('date', { ascending: false })

        transactions = txs || []

        // Fetch dependencies for EditDialog
        const { data: cats } = await supabase.from('categories').select('*').order('name')
        allCategories = cats || []

        const { data: projs } = await supabase.from('projects').select('*').order('name')
        allProjects = projs || []
    } else {
        // Fetch resources (existing logic)
        const { data: res } = await supabase
            .from('resources')
            .select('*')
            .eq('category_id', id)
            .order('created_at', { ascending: false })
        resources = res || []
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/dashboard/categories">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {category.name}
                        {isFinance && (
                            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                                {category.type}
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground">
                        {isFinance
                            ? `${transactions.length} transactions`
                            : `${resources.length} resources in this category`
                        }
                    </p>
                </div>
            </div>

            {isFinance ? (
                <div className="grid gap-6">
                    <TransactionList
                        transactions={transactions}
                        categories={allCategories}
                        projects={allProjects}
                    />
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {resources.map((resource: any) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}

                    {resources.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
                            No resources in this category yet.
                            <div className="mt-4">
                                <Link href="/dashboard/resources/new">
                                    <Button variant="outline">Add Resource</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
