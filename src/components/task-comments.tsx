import type React from "react";
import { cn } from "~/lib/utils";
import { api, RouterOutputs } from "~/utils/api";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";

export default function TaskComments({ taskId }: { taskId: string }) {
  const queryClient = api.useUtils();
  const comments = api.comments.getByTaskId.useQuery({
    taskId: taskId,
  });
  const commentPostMut = api.comments.add.useMutation({
    // Optimistically update the UI before the server responds
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.comments.getByTaskId.cancel({ taskId });

      // Snapshot the previous value
      const previousComments = queryClient.comments.getByTaskId.getData({
        taskId,
      });

      // Optimistically update to the new value
      queryClient.comments.getByTaskId.setData({ taskId }, (old) => {
        // Create a temporary fake ID for optimistic UI
        const tempId = `temp-${Date.now()}`;

        // Create optimistic comment with expected shape based on CommentItemProps
        const optimisticComment: RouterOutputs["comments"]["getByTaskId"][number] =
          {
            id: tempId,
            content: newComment.content,
            timestamp: new Date().toISOString(),
            author: {
              name: "You", // Ideally from auth context
              avatar: "", // Ideally from auth context
            },
            reactions: [],
          };

        return old ? [...old, optimisticComment] : [optimisticComment];
      });

      return { previousComments };
    },
    // If the mutation fails, roll back to the previous value
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.comments.getByTaskId.setData(
          { taskId },
          context.previousComments);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.comments.getByTaskId.invalidate({ taskId });
    },
  });

  return (
    <div className="w-full mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-white/50 dark:bg-zinc-900/50",
          "backdrop-blur-xl",
          "rounded-2xl",
          "transition-all duration-300",
          "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
        )}
      >
        <div className="h-[350px] overflow-y-auto p-5 space-y-5">
          {comments.data && comments.data.length > 0 ? (
            comments.data.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
              <p>No comments yet</p>
            </div>
          )}

          {comments.isLoading && (
            <div className="flex justify-center">
              <span className="text-sm text-zinc-500">Loading comments...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <CommentForm
            onSubmit={async (comment) => {
              await commentPostMut.mutateAsync({
                taskId: taskId,
                content: comment,
              });
            }}
            isSubmitting={commentPostMut.isPending}
          />
        </div>
      </div>
    </div>
  );
}
