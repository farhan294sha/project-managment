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
          callbackUrl: "/app/dashboard",
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen ">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b px-4 py-2 flex items-center justify-between">
            <SearchHeader />
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default AppPageLayout;
