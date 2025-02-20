import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "password must be at least 5 characters long"),
});

const loginSchema = signupSchema.omit({ name: true });

export const postRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const cheakUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (cheakUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exist Sign In",
        });
      }

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
        name: user.name,
      };
    }),
  signin: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
          password: { not: null },
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found Sign up",
        });
      }
      if (!user.password) {
        throw new TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "try another method",
        });
      }

      const isValidPassword = await bcrypt.compare(
        input.password,
        user.password
      );

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
});
