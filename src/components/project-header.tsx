import { Button } from "./ui/button";
import { api } from "~/utils/api";
import InviteMember from "./member-invite";
import ProjectHeaderSkeleton from "./loading-skeleton/project-headers";
import { useActiveProjectState } from "~/store/active-project";
import TaskFilters from "./filters";
import ProjectTitle from "./project-header-title";

const ProjectHeader = () => {
  const { data } = useActiveProjectState();
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = api.project.getbyId.useQuery(
    { id: data?.projectId || "" },
    { enabled: !!data?.projectId }
  );

  if (!data?.projectId) {
    return <ProjectHeaderSkeleton />; // Show skeleton when projectId is missing
  }

  if (isLoading) {
    return <ProjectHeaderSkeleton />;
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
    <div className="flex justify-between py-6 px-6 bg-gradient-to-t from-transparent from-5%% to-white to-40% sticky top-0 z-50">
      <div>
        <div className="flex items-center gap-4">
          <ProjectTitle projectName={project.name} />
        </div>
        <div className="flex items-stretch gap-4 pt-8 text-muted-foreground">
          <TaskFilters />
        </div>
      </div>
      <div>
        <InviteMember project={project} />
      </div>
    </div>
  );
};
export default ProjectHeader;
