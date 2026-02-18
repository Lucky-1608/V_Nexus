'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { addTransaction } from '@/app/dashboard/finances/actions'
import { useSearchParams, useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    type: string
    user_id: string
}

interface Project {
    id: string
    name: string
}

// Use only custom categories from DB (filtered by server page)

export function AddTransactionDialog({ categories, projects, onAdd }: { categories: Category[], projects?: Project[], onAdd?: (t: any) => void }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<'Income' | 'Expense'>('Expense')
    const [category, setCategory] = useState<string>('')
    const [loading, setLoading] = useState(false)

    // Auto-open dialog if ?add=true is in URL
    useEffect(() => {
        if (searchParams.get('add') === 'true') {
            setOpen(true)
            const params = new URLSearchParams(searchParams.toString())
            params.delete('add')
            router.replace(`?${params.toString()}`, { scroll: false })
        }
    }, [searchParams, router])

    // Although server filters, let's be extra safe here
    // Filter out any resource categories, just in case
    const financeCategories = categories.filter(c => ['Income', 'Expense', 'Finance'].includes(c.type))
    const availableCategories = financeCategories.map(c => c.name).sort()

    // Ensure 'Other' is always at the end, and add 'Create New'
    const sortedCategories = availableCategories.filter(c => c !== 'Other').concat('Other')
    // Remove duplicates just in case
    const uniqueCategories = Array.from(new Set(sortedCategories))

    async function onSubmit(formData: FormData) {
        setLoading(true)

        // Optimistic Update
        if (onAdd) {
            const type = formData.get('type') as 'Income' | 'Expense'
            const amount = parseFloat(formData.get('amount') as string)
            const dateStr = formData.get('date') as string
            const projectId = formData.get('projectId') as string
            const description = formData.get('description') as string
            const categoryName = formData.get('category') as string
            const customCategory = formData.get('custom_category') as string

            let finalCategoryName = categoryName
            if ((categoryName === 'Other' || categoryName === '_create_new_') && customCategory && customCategory.trim()) {
                finalCategoryName = customCategory.trim()
            }

            const newTransaction = {
                id: crypto.randomUUID(),
                type,
                amount,
                date: (() => {
                    if (dateStr) {
                        const d = new Date(dateStr)
                        const now = new Date()
                        d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
                        return d.toISOString()
                    }
                    return new Date().toISOString()
                })(),
                category_id: 'temp',
                category_name: finalCategoryName,
                description,
                user_id: 'temp',
                project_id: projectId !== 'undefined' ? projectId : undefined
            }
            onAdd(newTransaction)
            setOpen(false)
        }

        try {
            const result = await addTransaction(formData)
            if (result?.error) {
                toast.error(result.error)
                // In a perfect world we would revert optimistic here
                return
            }
            if (!onAdd) {
                toast.success("Transaction added successfully")
                setOpen(false)
            } else {
                toast.success("Transaction added successfully")
            }
        } catch (error) {
            console.error('Failed to add transaction', error)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={type} onValueChange={(v: 'Income' | 'Expense') => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Income">Income</SelectItem>
                                    <SelectItem value="Expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="project">Project (Optional)</Label>
                        <Select name="projectId">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="undefined">None</SelectItem>
                                {projects?.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input type="number" name="amount" placeholder="0.00" required step="0.01" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent position="popper" viewportClassName="max-h-[200px]">
                                {uniqueCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                                <SelectItem value="_create_new_" className="text-primary font-medium border-t mt-1 pt-1">
                                    + Create New Category
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(category === 'Other' || category === '_create_new_') && (
                        <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Label htmlFor="custom_category">
                                {category === '_create_new_' ? 'New Category Name' : 'Custom Name (Optional)'}
                            </Label>
                            <Input
                                name="custom_category"
                                placeholder={category === '_create_new_' ? "e.g. Subscriptions" : "e.g. Side Hustle, Gift"}
                                className="bg-muted/50"
                                required={category === '_create_new_'}
                                autoFocus={category === '_create_new_'}
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input name="description" placeholder="Optional note" />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
