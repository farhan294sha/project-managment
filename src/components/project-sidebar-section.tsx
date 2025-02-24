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
import { useActiveProjectState } from "~/store/active-project";

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
  const projects = api.project.getAll.useQuery(undefined, { retry: 1 });
  const router = useRouter();

  const [showInput, setShowInput] = useState(false);

  const { data, setData } = useActiveProjectState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (projects.isSuccess && projects.data && projects.data.length > 0) {
      const firstProject = projects.data[0];
      if (!data?.projectId) {
        router.push(`/app/${firstProject?.id}`); 
        setData({ projectId: firstProject?.id });
      }
    }
  }, [projects.isSuccess, projects.data, router, data, setData]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");
  const handleAddProject = () => {
    setShowInput(true);
    // Focus the input field when it is shown
    setTimeout(() => inputRef.current?.focus(), 0);
  };

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
          {projects.isLoading ? (
            <div className="space-y-3 ml-2 ">
              <Skeleton className="h-2 w-[70%]" />
              <Skeleton className="h-2 w-[70%]" />
              <Skeleton className="h-2 w-[70%]" />
            </div>
          ) : projects.data && projects.data.length > 0 ? ( // Check if projects.data is not empty
            projects.data.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={project.name}
                  className="text-muted-foreground"
                  onClick={() => setData({ projectId: project.id })}
                  isActive={project.id === data?.projectId}
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
            ))
          ) : projects.isError && projects.error.data?.code === "NOT_FOUND" ? (
            <div>Create New Project</div>
          ) : (
            <p>No projects found.</p> // Or some other default message
          )}

          {error && <p className="text-red-500">{error}</p>}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default ProjectSidebarSection;
