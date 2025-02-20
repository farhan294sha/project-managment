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
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";
import ProjectCreateInput from "./project-create";
import { useRouter } from "next/navigation";

const projectColours = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];
const ProjectSidebarSection = () => {
  const projects = api.project.getAll.useQuery();
  const router = useRouter();

  const [showInput, setShowInput] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Ensure client-side execution
    if (projects.isSuccess && projects.data && projects.data.length > 0) {
      const firstProject = projects.data[0];
      router.push(`/app/${firstProject?.id}`);
    }
  }, [projects.isSuccess, projects.data, router]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");
  const handleAddProject = () => {
    setShowInput(true);
    // Focus the input field when it is shown
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (projects.isLoading) {
    // TODO: Better skeleton
    return <Skeleton className="h-2 w-[70%]" />;
  }

  if (projects.error) {
    return <div>Error: {projects.error.message}</div>;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center pr-2">
        <SidebarGroupLabel className="flex-grow">MY PROJECTS</SidebarGroupLabel>
        <Button
          variant={"purpleIcon"}
          size={"purpleIcon"}
          onClick={handleAddProject}
        >
          <Plus className="h-4 w-4 text-primary/70" />
        </Button>
      </div>

      <SidebarGroupContent>
        {/* TODO: move to seprate components */}
        <SidebarMenu>
          {showInput && (
            <ProjectCreateInput
              ref={inputRef}
              setError={setError}
              setShowInput={setShowInput}
            />
          )}
          {projects.data &&
            projects.data.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={project.name}
                  className="text-muted-foreground"
                >
                  <Link href={`/app/${project.id}`}>
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        projectColours[
                          Math.floor(Math.random() * projectColours.length)
                        ]
                      )}
                    />
                    <span className="font-medium">{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          {error && <p className="text-red-500">{error}</p>}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default ProjectSidebarSection;
