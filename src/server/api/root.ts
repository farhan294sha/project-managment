import { postRouter } from "~/server/api/routers/post";
import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  test: publicProcedure.query(() => {
    return { message: "working" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    // Log the error for debugging
    console.error("tRPC Error:", error);

    // Generic error response
    return {
      statusCode:
        error.code === "UNAUTHORIZED"
          ? 401
          : error.code === "NOT_FOUND"
            ? 404
            : 500,
      body: JSON.stringify({
        message: error.message || "Something went wrong",
        code: error.code || "INTERNAL_SERVER_ERROR",
      }),
    };
  },
});

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
