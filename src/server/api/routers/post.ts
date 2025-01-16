import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
});

export const postRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        email: input.email,
        password: { not: null },
      },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    if (!user.password) {
      throw new TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: "try another method",
      });
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Password is invalid",
      });
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }),

  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
          },
        });
        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
      } catch (error) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "failed to create user", cause: error})
      }
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
