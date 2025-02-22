import { Calendar, ChevronDown, Filter, Link2, SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import { Skeleton } from "./ui/skeleton";
import InviteMember from "./member-invite";
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
        <InviteMember project={project} />
      </div>
    </div>
  );
};
export default ProjectHeader;
