import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { cn } from "~/lib/utils";
const projects = [
  {
    name: "Mobile App",
    color: "bg-purple-500",
  },
  {
    name: "Website Redesign",
    color: "bg-yellow-500",
  },
  {
    name: "Design System",
    color: "bg-pink-500",
  },
  {
    name: "Wireframes",
    color: "bg-blue-500",
  },
];

const ProjectSidebarSection = () => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center pr-2">
        <SidebarGroupLabel className="flex-grow">MY PROJECTS</SidebarGroupLabel>
        <Button variant={"purpleIcon"} size={"purpleIcon"}>
          <Plus className="h-4 w-4 text-primary/70" />
        </Button>
      </div>

      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton
                asChild
                tooltip={project.name}
                className="text-muted-foreground"
              >
                <a href="#">
                  <div className={cn("h-2 w-2 rounded-full", project.color)} />
                  <span className="font-medium">{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default ProjectSidebarSection;
