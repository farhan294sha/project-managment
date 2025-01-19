import { z } from "zod";
import { postRouter } from "~/server/api/routers/post";
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  hello: publicProcedure.input(z.string()).query(({ input }) => {
    return { text: input };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
// lambda handiler
// export const handler = awsLambdaRequestHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
//   onError: ({ error }) => {
//     // Log the error for debugging
//     console.log("ReqEroor: ", error);
//     // Generic error response
//     return {
//       statusCode:
//         error.code === "UNAUTHORIZED"
//           ? 401
//           : error.code === "NOT_FOUND"
//             ? 404
//             : 500,
//       body: JSON.stringify({
//         message: error.message || "Something went wrong",
//         code: error.code || "INTERNAL_SERVER_ERROR",
//       }),
//     };
//   },
// });
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
export const trpc = createCaller({
  db,
  session: null,
});

// Create a server-side caller with the correct context
