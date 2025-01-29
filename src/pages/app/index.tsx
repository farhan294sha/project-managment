"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import SpinLoader from "~/components/loader-spin";
import SearchHeader from "~/components/Search-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const AppPageLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    async function authenticate() {
      if (status === "unauthenticated") {
        await signIn(undefined, {
          callbackUrl: "/app/project",
        });
      }
    }
    if (status === "unauthenticated") {
      void authenticate();
    }
  }, [status]);

  if (status === "loading") {
    return <SpinLoader />;
  }

  if (!session) {
    return null; // Redirecting, so no need to render anything
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-4 border-b px-6">
            <SearchHeader />
          </header>
          <main className="flex-1 px-7 pt-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default AppPageLayout;
