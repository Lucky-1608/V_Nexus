import { MessageSquare } from "lucide-react";
import { getUserTeams } from "./queries";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default async function ChatPage() {
    const teams = await getUserTeams()

    return (
        <div className="h-full">
            {/* Mobile View: Show Team List */}
            <div className="md:hidden h-full">
                <ChatSidebar teams={teams} />
            </div>

            {/* Desktop View: Show Placeholder */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 h-full text-muted-foreground bg-card/40 backdrop-blur-xl border-l border-border/50 saturate-150">
                <div className="bg-primary/10 p-6 rounded-full mb-4 shadow-sm border border-primary/20">
                    <MessageSquare className="h-12 w-12 text-primary drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Select a Chat</h3>
                <p className="max-w-sm text-center text-sm">
                    Choose a team or project from the sidebar to start collaborating with your team.
                </p>
            </div>
        </div>
    )
}
