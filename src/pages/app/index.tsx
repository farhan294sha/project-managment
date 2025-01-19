"use client";
import { type ReactNode } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import SearchHeader from "~/components/Search-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const AppPageLayout = ({ children }: { children: ReactNode }) => {
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
