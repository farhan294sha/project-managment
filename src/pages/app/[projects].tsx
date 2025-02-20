import { useEffect, useRef, useState, type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";
import AppPageLayout from ".";
import ProjectHeader from "~/components/project-header";
import ProjectTasks from "~/components/project-tasks";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import ProjectCreateInput from "~/components/project-create";
import { useRouter as _useRouter } from "next/router";
import { useRouter } from "next/navigation";

const Projects: NextPageWithLayout = () => {
  const routerPush = useRouter();
  const router = _useRouter();
  const [showInput, setShowInput] = useState(false);
  const projects = api.project.getAll.useQuery();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (projects.isSuccess && projects.data && projects.data.length > 0) {
      const firstProject = projects.data[0];
      routerPush.push(`/app/${firstProject?.id}`);
    }
  }, [projects.isSuccess, projects.data, routerPush]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");
  const handleAddProject = () => {
    setShowInput(true);
    // Focus the input field when it is shown
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const query = router.query.projects ?? "NONE";
  if (typeof query !== "string") {
    // TODO: better handiling
    return <div>Invalid req</div>;
  }
  if (projects.isError) {
    return <Button onClick={() => projects.refetch()}>Retry</Button>;
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
    <div className="grid h-screen w-full grid-rows-4">
      <ProjectHeader projectId={query} />
      <ProjectTasks projectId={query} />
    </div>
  );
};
export default Projects;
Projects.getLayout = function getLayout(page: ReactElement) {
  return <AppPageLayout>{page}</AppPageLayout>;
};
