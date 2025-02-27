import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema } from "~/utils/schema/task";
import { TRPCError } from "@trpc/server";
import { TaskStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        memberEmails,
        taskStatus,
        tags,
        files,
      } = input;

      const project = await ctx.db.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      let assignedToUsers: { email: string | null; id: string }[] = [];
      if (memberEmails && memberEmails.length > 0) {
        assignedToUsers = await ctx.db.user.findMany({
          where: { email: { in: memberEmails } },
          select: { email: true, id: true },
        });
        // cheaking db if revied email has user
        if (assignedToUsers.length !== memberEmails.length) {
          const foundEmails = assignedToUsers.map((user) => user.email);
          const missingEmails = memberEmails.filter(
            (email) => !foundEmails.includes(email)
          );
          throw new TRPCError({
            message: `Users with the following emails not found: ${missingEmails.join(", ")}`,
            code: "NOT_FOUND",
          });
        }
      }

      const filteredImageId =
        files &&
        (files.filter((file) => file.imageId !== null) as {
          imageId: string;
        }[]);
      try {
        const task = await ctx.db.task.create({
          data: {
            title,
            description,
            priority,
            deadline,
            createdById: ctx.session.user.id,
            projectId,
            status: taskStatus,
            assignedTo: {
              connect: assignedToUsers.map((user) => ({ id: user.id })),
            },
            tags: {
              connectOrCreate: tags?.map((tagName) => ({
                where: { name: tagName, projectId: projectId },
                create: { name: tagName, projectId: projectId },
              })),
            },
            files: {
              connect:
                filteredImageId &&
                filteredImageId.map((file) => ({ id: file.imageId })),
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
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              message: "Task is not found",
              code: "NOT_FOUND",
            });
          }
        }
      }
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

      const users = await ctx.db.user.findMany({
        where: { email: { in: memberEmails } },
      });

      if (users.length !== memberEmails.length) {
        const foundEmails = users.map((user) => user.email);
        const missingEmails = memberEmails.filter(
          (email) => !foundEmails.includes(email)
        );
        throw new TRPCError({
          message: `Users with the following emails not found: ${missingEmails.join(", ")}`,
          code: "NOT_FOUND",
        });
      }

      const updatedTask = await ctx.db.task.update({
        where: { id: taskId },
        data: {
          assignedTo: {
            connect: users.map((user) => ({ id: user.id })),
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
        projectId,
        memberEmails,
        taskStatus,
        tags,
      } = input;

      const existingTask = await ctx.db.task.findUnique({
        where: { id: id },
        include: {
          assignedTo: true,
          tags: true,
        },
      });

      if (!existingTask) {
        throw new TRPCError({
          message: "Task not found",
          code: "NOT_FOUND",
        });
      }

      if (projectId && projectId !== existingTask.projectId) {
        const project = await ctx.db.project.findUnique({
          where: { id: projectId },
        });

        if (!project) {
          throw new TRPCError({
            message: "Project not found",
            code: "NOT_FOUND",
          });
        }
      }

      let assignedToUsers: { email: string | null; id: string }[] = [];
      if (memberEmails && memberEmails.length > 0) {
        assignedToUsers = await ctx.db.user.findMany({
          where: { email: { in: memberEmails } },
          select: { email: true, id: true },
        });

        if (assignedToUsers.length !== memberEmails.length) {
          const foundEmails = assignedToUsers.map((user) => user.email);
          const missingEmails = memberEmails.filter(
            (email) => !foundEmails.includes(email)
          );
          throw new TRPCError({
            message: `Users with the following emails not found: ${missingEmails.join(
              ", "
            )}`,
            code: "NOT_FOUND",
          });
        }
      }
      try {
        const updatedTask = await ctx.db.task.update({
          where: { id: id },
          data: {
            title: title,
            description: description,
            priority: priority,
            deadline: deadline,
            projectId: projectId,
            status: taskStatus,
            assignedTo: memberEmails
              ? {
                  set: assignedToUsers.map((user) => ({ id: user.id })),
                }
              : undefined,
            tags: tags
              ? {
                  set: tags.map((tagName) => ({ name: tagName })),
                }
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
      try {
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
        });
        return data;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error deleting task:", error); // Log the error for debugging

        throw new TRPCError({
          message: "Something went wrong while deleting the task.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
