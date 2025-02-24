import { GeistSans } from "geist/font/sans";
import type { AppProps, AppType } from "next/app";
import React, { type ReactElement, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import type { DefaultSession, Session } from "next-auth";
import type { NextPage } from "next";
import { api } from "~/utils/api";
import { Toaster } from "~/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
  }
}

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <style jsx global>{`
          html {
            font-family: ${GeistSans.style.fontFamily}; // for dalog box
          }
        `}</style>
        <main className={GeistSans.className}>
          {getLayout(<Component {...pageProps} />)}
        </main>
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
