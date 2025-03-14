import { useEffect, useRef, useState, type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";
import AppPageLayout from ".";
import ProjectHeader from "~/components/project-header";
import ProjectTasks from "~/components/project-tasks";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import ProjectCreateInput from "~/components/project-create";
import { Loader2 } from "lucide-react";
import { useActiveProjectState } from "~/store/active-project";
import { TaskFilterProvider } from "~/context/task-filter-provider";
import { useIsProjectTaskFecting } from "~/store/filters";

const Projects: NextPageWithLayout = () => {
  const [showInput, setShowInput] = useState(false);
  const projects = api.project.getAll.useQuery();
  const { data } = useActiveProjectState();
  const {
    data: projectTask,
    isLoading,
  } = api.task.getTask.useQuery(
    { projectId: data?.projectId || "" },
    { enabled: !!data?.projectId }
  );
  const { setData: isFeching } = useIsProjectTaskFecting(data?.projectId ?? "");


  useEffect(() => {
    isFeching(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");
  const handleAddProject = () => {
    setShowInput(true);
    // Focus the input field when it is shown
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  if (projects.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!projects.data || projects.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-2">
        {showInput && (
          <div className="flex gap-2">
            <ProjectCreateInput
              ref={inputRef}
              setError={setError}
              setShowInput={setShowInput}
            />
            <Button
              onClick={() => {
                if (inputRef.current) {
                  // Create a new keyboard event for 'Enter'
                  const event = new KeyboardEvent("keydown", { key: "Enter" });

                  // Dispatch the event on the input element
                  inputRef.current.dispatchEvent(event);
                }
              }}
            >
              Create
            </Button>
          </div>
        )}
        {!showInput && (
          <Button onClick={handleAddProject}>Create new Project</Button>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }
  return (
    <TaskFilterProvider initialTasks={projectTask}>
      <div className="overflow-auto">
        <ProjectHeader />
        <ProjectTasks />
      </div>
    </TaskFilterProvider>
  );
};
export default Projects;
Projects.getLayout = function getLayout(page: ReactElement) {
  return <AppPageLayout>{page}</AppPageLayout>;
};
