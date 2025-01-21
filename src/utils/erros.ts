import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export function clientZodError(error: TRPCClientError<AppRouter>) {
  // Check if the error is a Zod error
  if (error.data?.code === "BAD_REQUEST" && error.shape?.data?.zodError) {
    // Extract Zod error messages
    const zodError = error.shape.data.zodError;
    const fieldErrors = zodError.fieldErrors;
    return Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
      .join("\n");
  }
}
