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
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      const users = await ctx.db.user.findMany({
        where: { email: { in: memberEmails } },
        select: {
          id: true,
          email: true,
        },
      });

      // Check if all emails correspond to valid users
      if (users.length !== memberEmails.length) {
        const foundEmails = users.map((user) => user.email);
        const missingEmails = memberEmails.filter(
          (email) => !foundEmails.includes(email),
        );
        // sent email to missing emails
        throw new TRPCError({
          message: `Users with the following emails not found: ${missingEmails.join(", ")}`,
          code: "NOT_FOUND",
        });
      }

      const updatedProject = await ctx.db.project.update({
        where: { id: projectId },
        data: {
          members: {
            connect: users.map((user) => ({ id: user.id })),
          },
        },
        select: {
          _count: {
            select: { members: true },
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
    .mutation(async ({ ctx, input }) => {
      const { projectId, title } = input;

      const updatedTitle = await ctx.db.project.update({
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
    if (projects.length <= 0) {
      throw new TRPCError({ message: "Create new project", code: "NOT_FOUND" });
    }
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

      if (!projects) {
        throw new TRPCError({
          message: "Project not found",
          code: "NOT_FOUND",
        });
      }

      return projects;
    }),

  getMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const members = await ctx.db.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          members: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!members) {
        throw new TRPCError({
          message: "No members added in project",
          code: "NOT_FOUND",
        });
      }
      return members.members;
    }),
  getTags: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const tags = await ctx.db.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      if (!tags) {
        throw new TRPCError({ message: "No tags found", code: "NOT_FOUND" });
      }

      return tags.tags;
    }),

  updateTags: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, tags } = input;

      const projectTags = tags.map((tag) => {
        return { projectId: projectId, name: tag };
      });

      const createdTags = await ctx.db.tag.createMany({
        data: projectTags,
        skipDuplicates: true,
      });

      return createdTags;
    }),
});
