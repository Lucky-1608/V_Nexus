'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { updateTransaction } from '@/app/dashboard/finances/actions'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface Transaction {
    id: string
    type: 'Income' | 'Expense' | string
    amount: number
    category_name: string
    description?: string
    date: string
    project_id?: string | null
}

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

export function EditTransactionDialog({ transaction, categories, projects }: { transaction: Transaction, categories: Category[], projects: Project[] }) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<'Income' | 'Expense'>(transaction.type as 'Income' | 'Expense')

    // Use only custom categories from DB (filtered by server page)
    // Extra safety filter
    const financeCategories = categories.filter(c => ['Income', 'Expense', 'Finance'].includes(c.type))
    const availableCategories = financeCategories.map(c => c.name).sort()

    // Ensure 'Other' is always at the end
    const sortedCategories = availableCategories.filter(c => c !== 'Other').concat('Other')
    const uniqueCategories = Array.from(new Set(sortedCategories))

    const isCustomInitially = !uniqueCategories.includes(transaction.category_name) && transaction.category_name !== 'Other' && transaction.category_name !== '_create_new_'
    const [category, setCategory] = useState<string>(isCustomInitially ? 'Other' : transaction.category_name)
    const [customCategory, setCustomCategory] = useState<string>(isCustomInitially ? transaction.category_name : '')

    // Add transaction has project_id? Need to check Transaction interface and backend data.
    // Assuming backend returns project_id for transactions now. We need to update Transaction interface here.
    const [projectId, setProjectId] = useState<string>(transaction.project_id || 'undefined')

    async function handleSubmit(formData: FormData) {
        // If Custom/Other is selected, override the category field with the custom value
        if ((category === 'Other' || category === '_create_new_') && customCategory) {
            formData.set('category', 'Other') // Allow backend to see it's a custom/new entry flow
            formData.set('custom_category', customCategory)

            // If it's _create_new_, we might want to ensure backend creates it.
            // The actions.ts logic handles both 'Other' and '_create_new_' equality check for categoryName.
            // But we can just set category to '_create_new_' in formData to be explicit if we want, 
            // OR the backend already checks: if (categoryName === 'Other' || categoryName === '_create_new_') ...

            // Let's set the category field in formData to match the selected value so backend logic triggers.
            formData.set('category', category)
        }

        const result = await updateTransaction(transaction.id, formData)

        if (result?.error) {
            toast.error(result.error)
            return
        }

        toast.success("Transaction updated successfully")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>
                        Make changes to your transaction here.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Select name="type" defaultValue={type} onValueChange={(v: 'Income' | 'Expense') => setType(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Income">Income</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={new Date(transaction.date).toISOString().split('T')[0]}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project" className="text-right">
                            Project
                        </Label>
                        <Select name="projectId" value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="undefined">None</SelectItem>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            defaultValue={transaction.amount}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <Select
                            name="category"
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent position="popper" viewportClassName="max-h-[200px]">
                                {uniqueCategories.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                                <SelectItem value="_create_new_" className="text-primary font-medium border-t mt-1 pt-1">
                                    + Create New Category
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(category === 'Other' || category === '_create_new_') && (
                        <div className="grid grid-cols-4 items-center gap-4 animate-in slide-in-from-top-2 fade-in">
                            <Label htmlFor="custom_category" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="custom_category"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder={category === '_create_new_' ? "e.g. Subscriptions" : "Custom Name"}
                                className="col-span-3"
                                required={category === '_create_new_'}
                                autoFocus={category === '_create_new_'}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={transaction.description}
                            className="col-span-3"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
