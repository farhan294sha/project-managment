/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "~/server/db";
import { getServerSession, type Session } from "next-auth";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { ZodError } from "zod";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

interface CreateContextOptions {
  session: Session | null;
}
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // Get the session from the server using the getServerSession wrapper function
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
// const timingMiddleware = t.middleware(async ({ next, path }) => {
//   const start = Date.now();

//   if (t._config.isDev) {
//     // artificial delay in dev
//     const waitMs = Math.floor(Math.random() * 4000) + 100;
//     await new Promise((resolve) => setTimeout(resolve, waitMs));
//   }

//   const result = await next();

//   const end = Date.now();
//   console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

//   return result;
// });

const globalErrorHandler = t.middleware(async ({ next, path }) => {
  try {
    return await next();
  } catch (err) {
    // Already a TRPC error, just rethrow
    if (err instanceof TRPCError) {
      throw err;
    }

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Invalid input: " + err.errors.map((e) => e.message).join(", "),
        cause: err,
      });
    }

    // Handle various Prisma errors
    if (err instanceof PrismaClientKnownRequestError) {
      // Handle specific Prisma error codes
      switch (err.code) {
        case "P2002": // Unique constraint violation
          throw new TRPCError({
            code: "CONFLICT",
            message: "Resource already exists",
            cause: err,
          });
        case "P2025": // Record not found
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resource not found",
            cause: err,
          });
        case "P2003": // Foreign key constraint failure
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Related resource not found",
            cause: err,
          });
        case "P2014": // The provided value is invalid for this type
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid value for this type",
            cause: err,
          });
        default:
          // Log the specific Prisma error for debugging
          console.error(`Prisma error (${err.code}) in ${path}:`, err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database operation failed",
            cause: err,
          });
      }
    }

    // Handle Prisma validation errors (e.g., invalid data types)
    if (err instanceof PrismaClientValidationError) {
      console.error(`Prisma validation error in ${path}:`, err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid data provided to database",
        cause: err,
      });
    }

    // Handle Prisma initialization errors
    if (err instanceof PrismaClientInitializationError) {
      console.error(`Prisma initialization error in ${path}:`, err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection error",
        cause: err,
      });
    }

    // Handle other types of errors with detailed logging
    console.error(`Unhandled error in tRPC procedure (${path}):`, {
      error: err,
      stack: err instanceof Error ? err.stack : undefined,
      message: err instanceof Error ? err.message : String(err),
    });

    // Generic error response for unhandled errors
    throw new TRPCError({
      code: "CLIENT_CLOSED_REQUEST",
      message: "An unexpected error occurred",
      cause: err instanceof Error ? err : undefined,
    });
  }
});
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.user` is not null.
 */
export const protectedProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .use(globalErrorHandler);
/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(globalErrorHandler);
