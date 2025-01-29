import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Cannot create with 0 char"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.create({
          data: {
            name: input.title,
            createdById: ctx.session.user.id,
            members: { connect: { id: ctx.session.user.id } },
          },
          select: {
            name: true,
            id: true,
          },
        });
        return { title: project.name, id: project.id };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
  // Better approch would be to sent mail
  addMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        memberEmails: z.array(z.string().email()), // Array of user emails to add as members
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { projectId, memberEmails } = input;

      const project = await ctx.db.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      const users = await ctx.db.user.findMany({
        where: { email: { in: memberEmails } },
      });

      // Check if all emails correspond to valid users
      if (users.length !== memberEmails.length) {
        const foundEmails = users.map((user) => user.email);
        const missingEmails = memberEmails.filter(
          (email) => !foundEmails.includes(email),
        );
        throw new Error(
          `Users with the following emails not found: ${missingEmails.join(", ")}`,
        );
      }

      const updatedProject = await ctx.db.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: users.map((user) => ({ id: user.id })), // Connect each user to the project
          },
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });

      return updatedProject;
    }),
  updateTitle: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1, "Title cannot be empty."),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { projectId, title } = input;

      const updatedTitle = ctx.db.project.update({
        data: {
          name: title,
        },
        where: {
          id: projectId,
        },
      });

      return updatedTitle;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        OR: [
          { createdById: ctx.session.user.id },
          { members: { some: { id: ctx.session.user.id } } },
        ],
      },
    });
    console.log("Projects: ", projects);
    return projects;
  }),
  getbyId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const projectId = input.id;
      try {
        const projects = await ctx.db.project.findUnique({
          where: {
            id: projectId,
          },
          select: {
            id: true,
            name: true,
            members: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        return projects;
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: error });
      }
    }),

  getTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      try {
        const project = await ctx.db.project.findUnique({
          where: {
            id: projectId,
          },
          select: {
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                imageUrls: true, // cannot filter as last 2
                assignedTo: {
                  select: {
                    image: true,
                  },
                },
                _count: {
                  select: { comments: true, files: true },
                },
              },
            },
          },
        });

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project id is invlaid or not found",
          });
        }

        //format to retrun 2 images (efficient would to do in db call need to pass raw sql for that)
        const filteredImage = project.tasks.map((task) => {
          return {
            ...task,
            imageUrls: task.imageUrls.slice(-2), // return last 2 images
          };
        });

        const taskByStatus = {
          todo: filteredImage.filter((task) => task.status === "Todo"),
          onProgress: filteredImage.filter(
            (task) => task.status === "InProgress",
          ),
          done: filteredImage.filter((task) => task.status === "Done"),
        };

        return taskByStatus;
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: error });
      }
    }),
});
