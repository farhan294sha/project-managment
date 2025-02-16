import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createTaskSchema } from "~/utils/schema/task";
import { TRPCError } from "@trpc/server";

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
      } = input;

      const project = await ctx.db.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error("Project not found");
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
          throw new Error(
            `Users with the following emails not found: ${missingEmails.join(", ")}`
          );
        }
      }

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
        throw new Error("Task not found");
      }

      const users = await ctx.db.user.findMany({
        where: { email: { in: memberEmails } },
      });

      if (users.length !== memberEmails.length) {
        const foundEmails = users.map((user) => user.email);
        const missingEmails = memberEmails.filter(
          (email) => !foundEmails.includes(email)
        );
        throw new Error(
          `Users with the following emails not found: ${missingEmails.join(", ")}`
        );
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
});
