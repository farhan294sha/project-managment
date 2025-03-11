import { format } from "date-fns";
import Image from "next/image";
import { cn } from "~/lib/utils";
import PickEmoji from "./Emoji";

interface CommentItemProps {
  comment: {
    id: string;
    author: {
      avatar: string;
      name: string | null;
    };
    timestamp: string;
    content: string;
    reactions?: {
      emoji: string;
      count: number;
      reacted: boolean;
    }[];
  };
  onReactionToggle: (commentId: string, emoji: string) => void;
  isTogglingReaction?: boolean;
}

const CommentItem = ({
  comment,
  onReactionToggle,
  isTogglingReaction,
}: CommentItemProps) => {
  // Handle emoji selection from picker
  const handleEmojiSelected = (emoji: string | null) => {
    if (emoji) {
      onReactionToggle(comment.id, emoji);
    }
  };

  // Handle reaction button click
  const handleReactionClick = (emoji: string) => {
    onReactionToggle(comment.id, emoji);
    // This will:
    // 1. Increase count and set reacted=true if user hasn't reacted
    // 2. Decrease count and set reacted=false if user already reacted
  };

  return (
    <div className="group/comment relative">
      <div className="flex items-start gap-3 mb-1">
        <Image
          src={comment.author.avatar || "/placeholder.svg"}
          alt={comment.author.name ?? ""}
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
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {comment.author.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {format(comment.timestamp, "dd.MM.yy HH:mm")}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {comment.content}
          </p>
        </div>

        {/* Emoji picker */}
        <PickEmoji
          type="reaction"
          className={cn("absolute right-2 z-10")}
          onChange={(data) => handleEmojiSelected(data.emoji)}
        />
      </div>

      {/* Reaction buttons */}
      {comment.reactions && comment.reactions.length > 0 && (
        <div className="flex items-center gap-1.5 ml-11 flex-wrap">
          {comment.reactions.map((reaction) => (
            <button
              type="button"
              key={reaction.emoji}
              disabled={isTogglingReaction}
              onClick={() => handleReactionClick(reaction.emoji)}
              className={cn(
                "px-2 py-1 rounded-lg text-xs",
                "transition-colors duration-200",
                reaction.reacted
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                "hover:bg-violet-200 dark:hover:bg-violet-800/30",
                isTogglingReaction && "opacity-50 pointer-events-none",
              )}
            >
              {reaction.emoji} {reaction.count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
