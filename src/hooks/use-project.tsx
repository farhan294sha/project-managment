import { useState, useEffect } from "react";
import { Task } from "~/components/task-card";
import { api } from "~/utils/api";

export function useProject(projectId: string) {
  const projectTask = api.project.getTask.useQuery({ projectId });
  const projectDetails = api.project.getAll.useQuery

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

  return { tasks, setTasks };
}
