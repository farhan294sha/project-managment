import { useState, useEffect } from "react";
import { Task } from "~/components/task-card";
import { useActiveProjectState } from "~/store/active-project";
import { api } from "~/utils/api";

export function useProject() {
  const { data } = useActiveProjectState();
  const projectTask = api.project.getTask.useQuery(
    { projectId: data?.projectId || "" },
    { enabled: !!data?.projectId }
  );

  const [tasks, setTasks] = useState<{
    todo: Task[];
    onProgress: Task[];
    done: Task[];
  }>({
    todo: [],
    onProgress: [],
    done: [],
  });

  useEffect(() => {
    if (projectTask.isSuccess) {
      setTasks(() => {
        return {
          todo: projectTask.data.todo,
          onProgress: projectTask.data.onProgress,
          done: projectTask.data.done,
        };
      });
    }
  }, [projectTask.data, projectTask.isSuccess]);

  return { tasks, setTasks, isLoading: projectTask.isLoading };
}
