'use client'

import { useState, startTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createLearningPathAndReturn } from '@/app/dashboard/actions'; // We will create this
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreatePathDialogProps {
    onAdd?: (path: any) => void;
}

export function CreatePathDialog({ onAdd }: CreatePathDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState('');
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('links', links);

            const result = await createLearningPathAndReturn(formData);

            if (result.error) {
                toast.error(result.error);
            } else if (result.path) {
                if (onAdd) {
                    startTransition(() => {
                        onAdd(result.path);
                    });
                }
                setOpen(false);
                toast.success('Learning Path created');
                setTitle('');
                setDescription('');
                setLinks('');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create path', error);
            toast.error('Failed to create path');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Path
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Learning Path</DialogTitle>
                    <DialogDescription>
                        Create a structured path to organize resources.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Mastering Next.js"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="links">Resource Links (Optional)</Label>
                        <Textarea
                            id="links"
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            placeholder="https://example.com/part-1&#10;https://example.com/part-2"
                            className="min-h-[100px] font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Add URLs separated by newlines.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Path
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
