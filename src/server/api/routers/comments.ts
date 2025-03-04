import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  getByTaskId: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
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

      const formattedComments = comments.map((comment) => {

        const emojiCounts: Record<string, number> = {};
        const reactedByUser: Record<string, boolean> = {};

  
        for (const reaction of comment.reactions) {
          const emoji = reaction.emoji;
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
          if (reaction.userId === ctx.session.user.id) {
            reactedByUser[emoji] = true;
          }
        }

        // 3. Format the reactions array based on emoji counts
        const formattedReactions = Object.keys(emojiCounts).map((emoji) => ({
          emoji: emoji,
          count: emojiCounts[emoji],
          reacted: !!reactedByUser[emoji], // Check if the current user reacted with this emoji
        }));

        return {
          id: comment.id,
          content: comment.content,
          author: {
            name: comment.user.name,
            avatar: comment.user.image || "",
          },
          timestamp: comment.createdAt.toISOString(),
          reactions: formattedReactions, // Use the newly formatted reactions
        };
      });

      return formattedComments;
    }),
  add: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string(),
      })
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
  toggleReaction: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        emoji: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId, emoji } = input;
      const userId = ctx.session.user.id;

      const comment = await ctx.db.comment.findUnique({
        where: {
          id: commentId,
        },
        select: {
          id: true,
        },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Cannot found comment",
          code: "NOT_FOUND",
        });
      }

      const reaction = await ctx.db.reaction.findUnique({
        where: {
          userId_commentId_emoji: {
            userId,
            commentId,
            emoji,
          },
        },
      });

      const isReacted = reaction ? true : false;

      if (isReacted) {
        await ctx.db.reaction.delete({
          where: {
            userId_commentId_emoji: {
              userId,
              commentId,
              emoji,
            },
          },
        });
      } else {
        await ctx.db.reaction.create({
          data: {
            userId,
            commentId,
            emoji,
          },
        });
      }
    }),
});
