import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  getByTaskId: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { taskId } = input;

      const comments = await ctx.db.comment.findMany({
        where: { taskId: taskId },
        orderBy: { createdAt: "asc" },
        take: 10,
        include: {
          reactions: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (!comments || comments.length === 0) {
        throw new TRPCError({
          message: "No comments found for given task",
          code: "NOT_FOUND",
        });
      }

      const formattedComments = comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: {
          name: comment.user.name,
          avatar: comment.user.image || "",
        },
        timestamp: comment.createdAt.toISOString(),
        reactions: comment.reactions.map((reaction) => ({
          emoji: reaction.emoji,
          count: reaction.count, // Use the count from the database
          reacted: reaction.reacted, // Use the reacted from the database
        })),
      }));

      return formattedComments;
    }),
  add: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId, content } = input;
      try {
        const task = await ctx.db.comment.create({
          data: {
            userId: ctx.session.user.id,
            taskId: taskId,
            content: content,
          },
          select: {
            id: true,
          },
        });
        return task;
      } catch (error) {
        throw new TRPCError({
          message: "Cannot create new comment",
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }),
});
