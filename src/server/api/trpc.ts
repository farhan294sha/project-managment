/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { type CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyEventV2,
} from "aws-lambda";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import jwt from "jsonwebtoken";

/**
 * No need of Nextjs context beacuse of hosting on aws lambda
 * 
 *You can use below code for Next js context 
   @example
 * export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({});
};
 * 
 * 
 */
export const createTRPCContext = async (
  opts: CreateAWSLambdaContextOptions<
    APIGatewayProxyEvent | APIGatewayProxyEventV2
  >,
) => {
  if (!opts) {
    //FIXME: if server-side req its not handiled by lambda (handle by nextjs need to handle nextjs way)
    return {
      db,
      event: {},
      context: { token: null },
    };
  }
  const authHeader =
    opts.event.headers?.authorization ?? opts.event.headers?.Authorization;

  console.log("auth headers", authHeader);

  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1] ?? null;
  }
  console.log("Token: ", token);

  return {
    db,
    event: opts.event, // AWS Lambda event
    context: {
      ...opts.context,
      token,
    },
  };
};

// /**
//  * This is the actual context you will use in your router. It will be used to process every request
//  * that goes through your tRPC endpoint.
//  *
//  * @see https://trpc.io/docs/context
//  */
// export const createTRPCContext = (_opts: CreateNextContextOptions) => {
//   return createInnerTRPCContext({});
// };

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
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
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  //   if (t._config.isDev) {
  //     // artificial delay in dev
  //     const waitMs = Math.floor(Math.random() * 400) + 100;
  //     await new Promise((resolve) => setTimeout(resolve, waitMs));
  //   }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.user` is not null.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.context.token) {
    console.log("reached cheak for token");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const decoded = jwt.verify(
      ctx.context.token,
      process.env.NEXTAUTH_SECRET!,
    ) as { id: string };
    if (typeof decoded !== "object" || !decoded?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token payload",
      });
    }
    console.log("decoded value", decoded);

    return next({
      ctx: {
        ...ctx,
        user: decoded,
      },
    });
  } catch (error) {
    if (error instanceof Error) throw new TRPCError({ code: "UNAUTHORIZED" });
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);
