import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    // Log the error for debugging

    // Handle TRPCClientError
    if (error instanceof TRPCClientError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error.message,
          code: error.data?.code || "BAD_REQUEST",
          zodError: error.data?.zodError,
        }),
      };
    }

    // Handle TRPCError
    if (error instanceof TRPCError) {
      return {
        statusCode:
          error.code === "UNAUTHORIZED"
            ? 401
            : error.code === "NOT_FOUND"
              ? 404
              : 500,
        body: JSON.stringify({
          message: error.message,
          code: error.code,
        }),
      };
    }

    // Handle generic errors
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      }),
    };
  },
});
