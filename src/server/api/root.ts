import { postRouter } from "~/server/api/routers/post";
import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  awsLambdaRequestHandler,
  type CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { type LambdaEvent } from "node_modules/@trpc/server/dist/adapters/aws-lambda/getPlanner";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  testProtected: protectedProcedure.query(({ ctx }) => {
    return { message: ctx.user.id };
  }),
});

let lambdaopts: CreateAWSLambdaContextOptions<LambdaEvent>;
// export type definition of API
export type AppRouter = typeof appRouter;
// lambda handiler
export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: (opts) => {
    // TODO: Need better way to handle context
    lambdaopts = opts;
    return createTRPCContext(opts);
  },
  onError: ({ error }) => {
    // Log the error for debugging

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
const createCaller = createCallerFactory(appRouter);

// Create a server-side caller with the correct context
export const strpc = createCaller(async () => {
  // undefined lambda is handeld on the function
  // just
  return await createTRPCContext(lambdaopts);
});
