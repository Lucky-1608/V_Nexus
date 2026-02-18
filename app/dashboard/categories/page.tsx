import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CategoriesManager from '../settings/categories-manager'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Folder } from 'lucide-react'
import { HoverEffect } from '@/components/ui/hover-effect'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { StaggerContainer, StaggerItem } from '@/components/ui/entrance'
import { Button } from '@/components/ui/button'
import { CreateCategoryDialog } from './create-category-dialog'
import { DashboardSearch } from '@/components/dashboard-search'

export default async function CategoriesPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q: searchQuery } = await searchParams
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*, resources(count), transactions(count)')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Browse your resources by category.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/settings?tab=categories">
                        <Button variant="outline">Manage Categories</Button>
                    </Link>
                    <CreateCategoryDialog />
                </div>
            </div>

            <DashboardSearch placeholder="Search categories..." />

            {/* Resource Categories Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Resource Categories</h2>
                <StaggerContainer key={`resources-${searchQuery}`} className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {categories?.filter((c: any) =>
                        (!c.type || c.type === 'resource') &&
                        (!searchQuery || (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
                    ).map((category: any) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}

                    {categories?.filter((c: any) => (!c.type || c.type === 'resource') && (!searchQuery || (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))).length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-10 border rounded-lg border-dashed">
                            No resource categories found.
                        </div>
                    )}
                </StaggerContainer>
            </div>

            {/* Finance Categories Section */}
            <div className="space-y-4 pt-4 border-t">
                <h2 className="text-xl font-semibold tracking-tight">Finance Categories</h2>
                <StaggerContainer key={`finances-${searchQuery}`} className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {categories?.filter((c: any) =>
                        (c.type === 'Income' || c.type === 'Expense' || c.type === 'Finance') &&
                        (!searchQuery || (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
                    ).map((category: any) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}

                    {categories?.filter((c: any) => (c.type === 'Income' || c.type === 'Expense' || c.type === 'Finance') && (!searchQuery || (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()))).length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-10 border rounded-lg border-dashed">
                            No finance categories found.
                        </div>
                    )}
                </StaggerContainer>
            </div>
        </div>
    )
}

function CategoryCard({ category }: { category: any }) {
    return (
        <StaggerItem className="h-full">
            <HoverEffect variant="lift">
                <Link href={`/dashboard/categories/${category.id}`}>
                    <SpotlightCard className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Folder className="h-5 w-5 text-blue-500" />
                                    {category.name}
                                </div>
                                {category.type && category.type !== 'resource' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                                        {category.type}
                                    </span>
                                )}
                            </CardTitle>
                            <CardDescription className="flex flex-col gap-1">
                                {(!category.type || category.type === 'resource' || (category.resources?.[0]?.count || 0) > 0) && (
                                    <span>
                                        {category.resources?.[0]?.count || 0} resources
                                    </span>
                                )}
                                {(category.transactions?.[0]?.count || 0) > 0 && (
                                    <span>
                                        {category.transactions?.[0]?.count} transactions
                                    </span>
                                )}
                                {/* Fallback if both are empty for finance category */}
                                {category.type && category.type !== 'resource' && (category.transactions?.[0]?.count || 0) === 0 && (category.resources?.[0]?.count || 0) === 0 && (
                                    <span>No transactions</span>
                                )}
                            </CardDescription>
                        </CardHeader>
                    </SpotlightCard>
                </Link>
            </HoverEffect>
        </StaggerItem>
    )
}
