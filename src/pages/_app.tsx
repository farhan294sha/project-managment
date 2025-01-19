import { GeistSans } from "geist/font/sans";
import type { AppProps, AppType } from "next/app";
import React, { type ReactElement, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import type { DefaultSession, Session } from "next-auth";
import type { NextPage } from "next";
import { api } from "~/utils/api";

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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <div className={GeistSans.className}>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
