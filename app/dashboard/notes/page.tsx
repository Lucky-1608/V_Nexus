import { getNotes } from './actions'
import { NotesLayout } from '@/components/notes/notes-layout'

export default async function NotesPage() {
    const notes = await getNotes()

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] gap-6">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                <p className="text-muted-foreground">
                    Capture your thoughts, code snippets, and ideas.
                </p>
            </div>

            <div className="flex-1 min-h-0">
                <NotesLayout initialNotes={notes} />
            </div>
        </div>
    )
}
