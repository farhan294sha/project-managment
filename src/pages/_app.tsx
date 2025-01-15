import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";

import "~/styles/globals.css";
import { trpc } from "../utils/trpc";
import superjson from "superjson";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "https://g2uucgoiwkqlpmctmq2vwmnv3e0vfted.lambda-url.ap-south-1.on.aws",
          transformer: superjson,
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default MyApp;
