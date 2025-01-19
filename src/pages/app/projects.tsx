import { type ReactElement } from "react";
import { type NextPageWithLayout } from "../_app";
import AppPageLayout from ".";
import ProjectHeader from "~/components/project-header";
import ProjectTasks from "~/components/project-tasks";

const Projects: NextPageWithLayout = () => {
  return (
    <div className="grid h-screen w-full grid-rows-4">
      <ProjectHeader />
      <ProjectTasks />
    </div>
  );
};
export default Projects;
Projects.getLayout = function getLayout(page: ReactElement) {
  return <AppPageLayout>{page}</AppPageLayout>;
};
