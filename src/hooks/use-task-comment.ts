import { useSession } from "next-auth/react";
import { api, RouterOutputs } from "~/utils/api";

export function useTaskComments(taskId: string) {
  const queryClient = api.useUtils();
  const { data: session } = useSession();

  // Query to fetch comments for a task
  const commentsQuery = api.comments.getByTaskId.useQuery(
    {
      taskId,
    },
    { retry: 0 },
  );

  // Mutation to add a new comment
  const addCommentMutation = api.comments.add.useMutation({
    // Update on client state before the server response for better ux
    onMutate: async (newComment) => {
      await queryClient.comments.getByTaskId.cancel({ taskId });

      const previousComments = queryClient.comments.getByTaskId.getData({
        taskId,
      });

      queryClient.comments.getByTaskId.setData({ taskId }, (old) => {
        const tempId = `temp-${Date.now()}`;

        const optimisticComment: RouterOutputs["comments"]["getByTaskId"][number] =
          {
            id: tempId,
            content: newComment.content,
            timestamp: new Date().toISOString(),
            author: {
              name: session?.user?.name ?? "",
              avatar: session?.user?.image ?? "",
            },
            reactions: [],
          };

        return old ? [...old, optimisticComment] : [optimisticComment];
      });

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.comments.getByTaskId.setData(
          { taskId },
          context.previousComments,
        );
      }
    },
    onSettled: () => {
      queryClient.comments.getByTaskId.invalidate({ taskId });
    },
  });

  // Mutation to add/toggle reaction to a comment
  const toggleReactionMutation = api.comments.toggleReaction.useMutation({
    onMutate: async ({ commentId, emoji }) => {
      await queryClient.comments.getByTaskId.cancel({ taskId });

      const previousComments = queryClient.comments.getByTaskId.getData({
        taskId,
      });

      queryClient.comments.getByTaskId.setData({ taskId }, (old) => {
        if (!old) return old;

        return old.map((comment) => {
          if (comment.id !== commentId) return comment;

          // Clone the comment to avoid mutating the cached data
          const updatedComment = { ...comment };

          // If reactions don't exist yet, create the array
          if (!updatedComment.reactions) {
            updatedComment.reactions = [
              {
                emoji,
                count: 1,
                reacted: true,
              },
            ];
            return updatedComment;
          }

          // Find if the reaction already exists
          const existingReactionIndex = updatedComment.reactions.findIndex(
            (r) => r.emoji === emoji,
          );

          if (existingReactionIndex >= 0) {
            // Reaction exists, toggle it
            const existingReaction = updatedComment.reactions[
              existingReactionIndex
            ] as (typeof updatedComment.reactions)[0];

            if (existingReaction.reacted) {
              // User already reacted, remove their reaction
              if (existingReaction.count > 1) {
                // Decrement count and mark as not reacted
                updatedComment.reactions = [
                  ...updatedComment.reactions.slice(0, existingReactionIndex),
                  {
                    ...existingReaction,
                    count: existingReaction.count - 1,
                    reacted: false,
                  },
                  ...updatedComment.reactions.slice(existingReactionIndex + 1),
                ];
              } else {
                // Remove the reaction completely if count would be 0
                updatedComment.reactions = updatedComment.reactions.filter(
                  (_, i) => i !== existingReactionIndex,
                );
              }
            } else {
              // User hasn't reacted, add their reaction
              updatedComment.reactions = [
                ...updatedComment.reactions.slice(0, existingReactionIndex),
                {
                  ...existingReaction,
                  count: existingReaction.count + 1,
                  reacted: true,
                },
                ...updatedComment.reactions.slice(existingReactionIndex + 1),
              ];
            }
          } else {
            // Reaction doesn't exist yet, add it
            updatedComment.reactions.push({
              emoji,
              count: 1,
              reacted: true,
            });
          }

          return updatedComment;
        });
      });

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.comments.getByTaskId.setData(
          { taskId },
          context.previousComments,
        );
      }
    },
    onSettled: () => {
      queryClient.comments.getByTaskId.invalidate({ taskId });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    addComment: async (content: string) =>
      await addCommentMutation.mutateAsync({ taskId, content }),
    isAddingComment: addCommentMutation.isPending,
    toggleReaction: async (commentId: string, emoji: string) =>
      await toggleReactionMutation.mutateAsync({ commentId, emoji }),
    isTogglingReaction: toggleReactionMutation.isPending,
  };
}
