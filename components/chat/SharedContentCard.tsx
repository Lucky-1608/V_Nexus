'use client'

import { Book, FileText, TrendingUp, GraduationCap, ArrowRight, Check, File as FileIcon, Image as ImageIcon, Download } from 'lucide-react'
import Link from 'next/link'
import { copyItemToAccount } from '@/app/dashboard/chat/shared-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SharedContentCard({ attachment }: { attachment: { type: string, item: any } }) {
    const { type, item } = attachment
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    let icon = <FileText className="h-4 w-4" />
    let color = "bg-blue-500/10 text-blue-500"

    switch (type) {
        case 'resource':
            icon = <Book className="h-4 w-4" />
            color = "bg-cyan-500/10 text-cyan-500"
            break
        case 'note':
            icon = <FileText className="h-4 w-4" />
            color = "bg-yellow-500/10 text-yellow-500"
            break
        case 'learning_path':
            icon = <GraduationCap className="h-4 w-4" />
            color = "bg-green-500/10 text-green-500"
            break
        case 'finance':
            icon = <TrendingUp className="h-4 w-4" />
            color = "bg-emerald-500/10 text-emerald-500"
            break
        case 'roadmap':
            icon = <TrendingUp className="h-4 w-4" /> // Or a Map-like icon
            color = "bg-indigo-500/10 text-indigo-500"
            break
        case 'local_file':
            icon = item.contentType?.startsWith('image/') ? <ImageIcon className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />
            color = "bg-primary/10 text-primary"
            break
    }

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Handle local files
        if (type === 'local_file') {
            window.open(item.url, '_blank')
            return
        }

        // Direct navigation for Roadmap (Page handles logic)
        if (type === 'roadmap') {
            router.push(`/dashboard/roadmaps/${item.id}`)
            return
        }

        if (type === 'finance') {
            router.push('/dashboard/finances')
            return
        }

        setIsLoading(true)
        const toastId = toast.loading('Opening shared item...')

        try {
            const result = await copyItemToAccount(item.id, type)

            if (result.success && result.newId) {
                if (result.isNew) {
                    toast.success('Added to account!', { id: toastId })
                } else if ((result as any).updated) {
                    toast.success('Updated local copy!', { id: toastId })
                } else {
                    toast.success('Opening item...', { id: toastId })
                }

                // Redirect to the item page
                if (type === 'resource') {
                    router.push('/dashboard/resources')
                } else if (type === 'note') {
                    router.push(`/dashboard/notes`)
                } else if (type === 'learning_path') {
                    router.push(`/dashboard/paths/${result.newId}/edit`)
                }
            }
        } catch (error: any) {
            console.error('Failed to open shared item:', error)
            // Handle specific duplicate error if it somehow slips through (though we now handle updates)
            if (error.message?.includes('already added')) {
                toast.error('Item already exists', { id: toastId })
            } else {
                toast.error('Failed to open item', { id: toastId })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Image Preview layout
    if (type === 'local_file' && item.contentType?.startsWith('image/')) {
        return (
            <div
                onClick={handleClick}
                className="relative overflow-hidden rounded-xl border border-border group/card cursor-pointer max-w-sm hover:ring-2 hover:ring-primary/50 transition-all"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="w-full aspect-video sm:aspect-auto h-auto object-cover max-h-64 bg-muted" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="text-white text-xs truncate mr-2">{item.name}</span>
                    <Download className="h-4 w-4 text-white shrink-0" />
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={handleClick}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-muted/50 transition-colors w-64 group/card cursor-pointer"
        >
            <div className={`p-2 rounded-lg ${color}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground capitalize mb-0.5">
                    {type === 'local_file' ? 'File Attachment' : type.replace('_', ' ')}
                </div>
                <div className="text-sm font-medium truncate">{item.title || item.name}</div>
            </div>
            {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
                type === 'local_file' ? (
                    <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0" />
                ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0" />
                )
            )}
        </div>
    )
}
