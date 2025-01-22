import {
  Calendar,
  ChevronDown,
  Filter,
  Link2,
  PlusIcon,
  SquarePen,
} from "lucide-react";
import { Button } from "./ui/button";
import { AvatarGroup } from "./avatar-group";
import { Avatar, AvatarImage } from "./ui/avatar";
import { api } from "~/utils/api";
import { Skeleton } from "./ui/skeleton";
type ProjectHeaderProps = {
  projectId: string;
};
const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = api.project.getbyId.useQuery({ id: projectId });

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <div>
        Error: {error.message}
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!project) {
    return <div>Create new project</div>;
  }

  return (
    <div className="flex h-full justify-between pt-6">
      <div className="">
        <div className="flex items-center gap-4">
          <div className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
            {project.name}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="purpleIcon" size="purpleIcon">
              <SquarePen className="h-4 w-4 text-primary/90" />
            </Button>
            <Button variant="purpleIcon" size="purpleIcon">
              <Link2 className="h-4 w-4 text-primary/90" />
            </Button>
          </div>
        </div>
        <div className="flex items-stretch gap-4 pt-8 text-muted-foreground">
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            <p>Filter</p>

            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            <p>Today</p>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <div className="flex gap-2">
          <div className="flex items-center justify-center gap-2">
            <Button size="purpleIcon" variant="purpleIcon">
              <PlusIcon className="h-4 w-4 text-primary/90" />
            </Button>
            <div className="font-medium text-primary">Invite</div>
          </div>
          {project.members.length > 0 && (
            <AvatarGroup>
              {project.members.length >= 5 ? (
                <div className="flex items-center -space-x-2">
                  {project.members.slice(0, 4).map((assignee, index) => (
                    <Avatar
                      key={index}
                      className="h-8 w-8 border-2 border-white"
                    >
                      <AvatarImage
                        src={assignee.image ?? undefined}
                        alt="Assignee"
                      />
                    </Avatar>
                  ))}
                  <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      +{project.members.length - 4}
                    </span>
                  </Avatar>
                </div>
              ) : (
                project.members.map((assignee, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-white">
                    <AvatarImage
                      src={assignee.image ?? undefined}
                      alt="Assignee"
                    />
                  </Avatar>
                ))
              )}
            </AvatarGroup>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectHeader;
