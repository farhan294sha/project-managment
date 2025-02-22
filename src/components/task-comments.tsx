"use client"

import type React from "react"

import { useState } from "react"
import {  Send, SmilePlus } from "lucide-react"
import Image from "next/image"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  reactions?: Array<{
    emoji: string
    count: number
    reacted: boolean
  }>
}

interface TaskCommentsProps {
  taskName?: string
  taskId?: string
  comments?: Comment[]
}

export default function TaskComments({
  comments = [
    {
      id: "1",
      content: "I've started working on this. The initial setup is complete.",
      author: {
        name: "Alex Chen",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      },
      timestamp: "2 hours ago",
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🚀", count: 1, reacted: false },
      ],
    },
    {
      id: "2",
      content: "Great start! Let me know if you need any help with the API integration.",
      author: {
        name: "Sarah Kim",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
      },
      timestamp: "1 hour ago",
    },
    {
      id: "1",
      content: "I've started working on this. The initial setup is complete.",
      author: {
        name: "Alex Chen",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      },
      timestamp: "2 hours ago",
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🚀", count: 1, reacted: false },
      ],
    },
    {
      id: "1",
      content: "I've started working on this. The initial setup is complete.",
      author: {
        name: "Alex Chen",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      },
      timestamp: "2 hours ago",
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🚀", count: 1, reacted: false },
      ],
    },
    {
      id: "1",
      content: "I've started working on this. The initial setup is complete.",
      author: {
        name: "Alex Chen",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      },
      timestamp: "2 hours ago",
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🚀", count: 1, reacted: false },
      ],
    },
    {
      id: "1",
      content: "I've started working on this. The initial setup is complete.",
      author: {
        name: "Alex Chen",
        avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      },
      timestamp: "2 hours ago",
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🚀", count: 1, reacted: false },
      ],
    },
    
  ],
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the new comment to your backend
    setNewComment("")
  }

  return (
    <div className="w-full mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-white/50 dark:bg-zinc-900/50",
          "backdrop-blur-xl",
          // "border border-zinc-200/50 dark:border-zinc-800/50",
          "rounded-2xl",
          "transition-all duration-300",
          // "hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
          "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
        )}
      >
        {/* <div className="px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl",
                    "bg-gradient-to-br from-violet-500 to-indigo-500",
                    "flex items-center justify-center",
                    "text-white font-medium text-sm",
                  )}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{taskName}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {taskId} • {comments.length} comments
                </p>
              </div>
            </div>
            <button
              type="button"
              className={cn(
                "p-2 rounded-xl",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "transition-colors duration-200",
              )}
            >
              <MoreHorizontal className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </div> */}

        <div className="h-[350px] overflow-y-auto p-5 space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="group/comment">
              <div className="flex items-start gap-3 mb-1">
                <Image
                  src={comment.author.avatar || "/placeholder.svg"}
                  alt={comment.author.name}
                  width={32}
                  height={32}
                  className={cn(
                    "rounded-xl",
                    "ring-2 ring-white dark:ring-zinc-900",
                    "transition-transform duration-200",
                    "group-hover/comment:scale-105",
                  )}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{comment.author.name}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{comment.content}</p>
                </div>
              </div>
              {comment.reactions && (
                <div className="flex items-center gap-1.5 ml-11">
                  {comment.reactions.map((reaction) => (
                    <button
                      type="button"
                      key={reaction.emoji}
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs",
                        "transition-colors duration-200",
                        reaction.reacted
                          ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                        "hover:bg-violet-200 dark:hover:bg-violet-800/30",
                      )}
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-zinc-50 dark:bg-zinc-800/50",
                  "border border-zinc-200 dark:border-zinc-700/50",
                  "rounded-xl",
                  "text-sm text-zinc-900 dark:text-zinc-100",
                  "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                  "transition-all duration-200",
                )}
              />
              <button
                type="button"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  "p-1.5 rounded-lg",
                  "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50",
                  "transition-colors duration-200",
                )}
              >
                <SmilePlus className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <Button
              type="submit"
              className={cn(
                "p-2.5 rounded-xl",
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

