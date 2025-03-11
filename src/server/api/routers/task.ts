import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema } from "~/utils/schema/task";
import { TRPCError } from "@trpc/server";
import { TaskStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateUsersByEmail } from "~/server/utils/users";

const assignMemberSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"), // Required task ID
  memberEmails: z.array(z.string().email()), // Array of user emails to assign
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        title,
        description,
        priority,
        deadline,
        projectId,
        memberEmails = [],
        taskStatus,
        tags = [],
        files = [],
      } = input;

      const project = await ctx.db.project.findUnique({
        where: { id: projectId },
        select: { id: true },
      });

      if (!project) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      const { userIds: assignedToUsers } = await validateUsersByEmail(
        ctx.db,
        memberEmails
      );

      const filteredImageId = files
        .filter((file): file is { imageId: string } => file.imageId !== null)
        .map((file) => ({ id: file.imageId }));

      const task = await ctx.db.task.create({
        data: {
          title,
          description,
          priority,
          deadline,
          createdById: ctx.session.user.id,
          projectId,
          status: taskStatus || "Todo",
          assignedTo:
            assignedToUsers.length > 0
              ? { connect: assignedToUsers }
              : undefined,
          tags: {
            connectOrCreate: tags?.map((tagName) => ({
              where: { name: tagName, projectId: projectId },
              create: { name: tagName, projectId: projectId },
            })),
          },
          files: {
            connect: filteredImageId,
          },
        },
        include: {
          assignedTo: {
            select: {
              email: true,
              image: true,
              name: true,
              id: true,
            },
          },
        },
      });

      return task;
    }),
  assignMember: protectedProcedure
    .input(assignMemberSchema)
    .mutation(async ({ input, ctx }) => {
      const { taskId, memberEmails } = input;

      const task = await ctx.db.task.findUnique({
        where: { id: taskId },
        select: {
          id: true,
        },
      });

      if (!task) {
        throw new TRPCError({ message: "Task not found", code: "NOT_FOUND" });
      }

      const { userIds: assignedToUsers } = await validateUsersByEmail(
        ctx.db,
        memberEmails
      );

      const updatedTask = await ctx.db.task.update({
        where: { id: taskId },
        data: {
          assignedTo: {
            connect: assignedToUsers,
          },
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return updatedTask;
    }),
  getMembers: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { taskId, projectId } = input;
      const members = await ctx.db.task.findFirst({
        where: {
          AND: [{ id: taskId }, { projectId: projectId }],
        },
        select: {
          assignedTo: {
            select: {
              id: true,
              image: true,
              email: true,
            },
          },
        },
      });

      if (!members) {
        throw new TRPCError({
          message: "No members assigned",
          code: "NOT_FOUND",
        });
      }

      return members;
    }),
  getbyId: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { taskId } = input;

      const task = await ctx.db.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          title: true,
          tags: true,
          description: true,
          deadline: true,
          createdAt: true,
          updatedAt: true,
          priority: true,
          files: {
            select: {
              url: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
          status: true,
          createdBy: {
            select: {
              image: true,
              name: true,
            },
          },
          assignedTo: {
            select: {
              image: true,
              email: true,
              name: true,
              id: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({ message: "Task Not Found", code: "NOT_FOUND" });
      }

      return task;
    }),
  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        title,
        description,
        priority,
        deadline,
        memberEmails = [],
        taskStatus,
        tags = [],
      } = input;

      const existingTask = await ctx.db.task.findUnique({
        where: { id: id },
        select: { projectId: true },
      });

      if (!existingTask) {
        throw new TRPCError({
          message: "Task not found",
          code: "NOT_FOUND",
        });
      }

      const { userIds: assignedToUsers } = await validateUsersByEmail(
        ctx.db,
        memberEmails
      );

      const updatedTask = await ctx.db.task.update({
        where: { id: id },
        data: {
          title: title,
          description: description,
          priority: priority,
          deadline: deadline,
          status: taskStatus,
          assignedTo:
            assignedToUsers.length > 0 ? { set: assignedToUsers } : undefined,
          tags:
            tags.length > 0
              ? { set: tags.map((tag) => ({ name: tag })) }
              : undefined,
        },
        include: {
          assignedTo: {
            select: {
              email: true,
              image: true,
              name: true,
              id: true,
            },
          },
          tags: true,
        },
      });

      return updatedTask;
    }),

  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.nativeEnum(TaskStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId, status } = input;
      try {
        const updatedTask = await ctx.db.task.update({
          where: {
            id: taskId,
          },
          data: {
            status: status,
          },
        });

        return updatedTask;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              message: "Task is not found",
              code: "NOT_FOUND",
            });
          }
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId } = input;
      const userId = ctx.session.user.id;
      const task = await ctx.db.task.findUnique({
        where: {
          id: taskId,
          createdById: userId,
        },
      });

      if (!task) {
        const exists = await ctx.db.task.findUnique({
          where: { id: taskId },
        });
        if (exists) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to delete this task.",
          });
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task not found.",
          });
        }
      }

      const data = ctx.db.task.delete({
        where: {
          id: taskId,
          createdById: ctx.session.user.id,
        },
        select: { id: true },
      });
      return data;
    }),
  getTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;

      const task = await ctx.db.task.findMany({
        where: {
          projectId: projectId,
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          assignedTo: {
            select: {
              name: true,
              image: true,
            },
          },
          files: {
            take: 2,
            select: {
              url: true,
            },
          },
          _count: {
            select: {
              files: true,
              comments: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project id is invlaid or not found",
        });
      }

      return task;
    }),
  getPendingTask: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.db.project.findMany({
      where: {
        members: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (project.length < 0) {
      throw new TRPCError({ message: "Project not found", code: "NOT_FOUND" });
    }    
  }),
});
