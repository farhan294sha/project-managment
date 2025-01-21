import { type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";
import AppPageLayout from ".";
import ProjectHeader from "~/components/project-header";
import ProjectTasks from "~/components/project-tasks";
import { useRouter } from "next/router";

const Projects: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query.projects ?? "NONE";
  if (typeof query !== "string") {
    // TODO: better handiling
    return <div>Invalid req</div>;
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
