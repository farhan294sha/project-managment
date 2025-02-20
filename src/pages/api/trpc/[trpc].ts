import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error }) => {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
      console.error("Something went wrong", error);
    }
  },
});
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10mb",
  },
};
