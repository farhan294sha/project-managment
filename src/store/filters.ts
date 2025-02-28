import { Task } from "~/components/task-card";
import { createGlobalState } from ".";

export const useFilterdTasks = createGlobalState<Task[]>("filteredTask", null);

export function useIsProjectTaskFecting(projectId: string) {
  return createGlobalState(`porject-Task-fetch${projectId}`, false)();
}
