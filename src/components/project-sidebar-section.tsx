import { Loader2, Plus, X } from "lucide-react";
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
import { KeyboardEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";
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
  const utils = api.useUtils();
  const [showInput, setShowInput] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const projects = api.project.getAll.useQuery();

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();

      setProjectName("");

      setShowInput(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleAddProject = () => {
    setShowInput(true);
    // Focus the input field when it is shown
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createProjectMutation.mutate({ title: projectName });
    }
  };

  if (projects.isLoading) {
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
            <div className="relative flex">
              <Input
                ref={inputRef}
                onKeyDown={handleKeyDown}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
              />
              <Button
                className="absolute right-0 top-[2px]"
                variant={"ghost"}
                size={"sm"}
                onClick={() => setShowInput(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              {createProjectMutation.isPending && (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary/50" />
                </div>
              )}
            </div>
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
                        ],
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
