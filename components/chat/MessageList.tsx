'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageItem, Message } from './MessageItem'

import { differenceInMinutes, isSameDay, isToday, isYesterday, format } from 'date-fns'

function formatDateLabel(date: Date) {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
}

import { motion, AnimatePresence } from 'framer-motion'

// Simplified MessageList
export function MessageList({ messages, teamId, projectId, onDelete, onUpdate, members }: {
    messages: Message[],
    teamId: string,
    projectId?: string,
    onDelete?: (id: string) => void,
    onUpdate?: (id: string, newText: string) => void,
    members: any[]
}) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    // Scroll to bottom when messages change
    // Strategies:
    // 1. Initial load: Scroll to bottom
    // 2. New message from me: Scroll to bottom
    // 3. New message from others: Scroll to bottom IF already at bottom, otherwise show indicator (TODO)

    const shouldAutoScroll = useRef(true)

    // Handle scroll events to determine if we should auto-scroll
    const handleScroll = () => {
        if (!scrollRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        // If within 100px of bottom, auto-scroll is enabled
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
        shouldAutoScroll.current = isAtBottom
    }

    // Scroll to bottom on initial mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [])

    // Scroll when messages change
    useEffect(() => {
        if (!scrollRef.current) return

        const lastMessage = messages[messages.length - 1]
        const isMyMessage = lastMessage?.is_sender

        if (shouldAutoScroll.current || isMyMessage) {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                }
            })
        }
    }, [messages.length])

    // Group messages
    const groupedMessages = messages.map((msg, index) => {
        const prevMsg = messages[index - 1]
        const isConsecutive = prevMsg
            && prevMsg.sender_id === msg.sender_id
            && differenceInMinutes(new Date(msg.created_at), new Date(prevMsg.created_at)) < 5

        return { ...msg, isConsecutive }
    })

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 w-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent overscroll-y-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
        >
            <div className="flex flex-col gap-1 pb-4">
                <AnimatePresence initial={false}>
                    {groupedMessages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.5, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                        >
                            <p>No messages yet.</p>
                            <p className="text-sm">Start the conversation!</p>
                        </motion.div>
                    )}

                    {groupedMessages.map((msg, index) => {
                        const prevMsg = groupedMessages[index - 1];
                        const isNewDay = !prevMsg || !isSameDay(new Date(msg.created_at), new Date(prevMsg.created_at));

                        return (
                            <motion.div
                                key={msg.id + '-container'}
                                // layout - Removed to fix scrolling issues
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className="flex flex-col"
                            >
                                {isNewDay && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-muted/30 backdrop-blur-md text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-1 rounded-full border border-border/50">
                                            {formatDateLabel(new Date(msg.created_at))}
                                        </div>
                                    </div>
                                )}
                                <MessageItem
                                    message={msg}
                                    isConsecutive={msg.isConsecutive}
                                    teamId={teamId}
                                    projectId={projectId}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    members={members}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}
