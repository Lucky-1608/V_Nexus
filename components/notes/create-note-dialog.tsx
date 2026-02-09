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
import { createNote } from '@/app/dashboard/notes/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreateNoteDialogProps {
    onAdd?: (note: any) => void;
}

export function CreateNoteDialog({ onAdd }: CreateNoteDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);

            // createNote returns { success: true, note } or { error }
            const result = await createNote(formData);

            if (result.error) {
                toast.error(result.error);
            } else if (result.note) {
                if (onAdd) {
                    startTransition(() => {
                        onAdd(result.note);
                    });
                }
                setOpen(false);
                toast.success('Note created');
                setTitle('');
                setContent('');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create note', error);
            toast.error('Failed to create note');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                    <DialogDescription>
                        Quickly capture a note.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            required
                        />
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note (Markdown supported)..."
                            className="flex-1 resize-none font-mono"
                        />
                    </div>
                    <DialogFooter className="mt-auto pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Note
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
