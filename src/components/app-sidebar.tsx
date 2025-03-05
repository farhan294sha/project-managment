import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import ProjectSidebarSection from "./project-sidebar-section";
import SidebarNav from "./sidebar-nav";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="max-w-[300px]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="grid grid-cols-4">
              <SidebarMenuButton
                size="lg"
                asChild
                className="col-span-3 group-data-[collapsible=icon]:hidden"
              >
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-semibold">P</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Project M.</span>
                  </div>
                </Link>
              </SidebarMenuButton>
              <div className="flex flex-col items-center justify-center group-data-[collapsible=icon]:col-span-4">
                <SidebarTrigger />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        {/* nav section */}
        <SidebarNav />
        <Separator className="mx-4 max-w-[220px]" />
        {/* project section */}
        <ProjectSidebarSection />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
