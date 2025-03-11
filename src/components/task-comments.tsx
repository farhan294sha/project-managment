import type React from "react";
import { cn } from "~/lib/utils";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import { Separator } from "~/components/ui/separator";
import { useTaskComments } from "~/hooks/use-task-comment";

export default function TaskComments({ taskId }: { taskId: string }) {
  const {
    addComment,
    isAddingComment,
    comments,
    isLoading,
    toggleReaction,
    isTogglingReaction,
  } = useTaskComments(taskId);
  return (
    <div className="w-full mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-white/50 dark:bg-zinc-900/50",
          "backdrop-blur-xl",
          "rounded-2xl",
          "transition-all duration-300",
          "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
        )}
      >
        <div className="h-[350px] overflow-y-auto p-5 space-y-5">
          {isLoading && (
            <div className="flex justify-center">
              <span className="text-sm text-zinc-500">Loading comments...</span>
            </div>
          )}

          {!isLoading &&
            comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <>
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReactionToggle={toggleReaction}
                  isTogglingReaction={isTogglingReaction}
                />
                <Separator />
              </>
            ))}

          {!isLoading && (!comments || comments.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
              <p>No comments yet</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <CommentForm
            onSubmit={async (comment) => {
              await addComment(comment);
            }}
            isSubmitting={isAddingComment}
          />
        </div>
      </div>
    </div>
  );
}
