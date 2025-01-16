import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { getSession, SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import { trpc } from "../utils/trpc";
import superjson from "superjson";
import { type Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            const session = await getSession();
            return {
              Authorization: `Bearer ${session?.token}`,
            };
          },
        }),
      ],
    }),
  );
  return (
    <SessionProvider session={session}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <div className={GeistSans.className}>
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};

export default MyApp;
