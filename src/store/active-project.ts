import { createGlobalState } from ".";

type ActiveProjectState = {
  projectId: string | null;
};

export const useActiveProjectState = createGlobalState<ActiveProjectState>(
  "projectId",
  {
    projectId: null,
  }
);
