import { useState, useEffect } from "react";
import { Task } from "~/components/task-card";
import { useTaskFilterContext } from "~/context/task-filter-provider";
import { useActiveProjectState } from "~/store/active-project";

export function useProject() {
  const { filteredTasks } = useTaskFilterContext();
  const { data } = useActiveProjectState();

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
    if (filteredTasks) {
      setTasks(() => {
        return {
          todo: filteredTasks
            ? filteredTasks.filter((task) => task.status === "Todo")
            : [],
          onProgress: filteredTasks
            ? filteredTasks.filter((task) => task.status === "InProgress")
            : [],
          done: filteredTasks
            ? filteredTasks.filter((task) => task.status === "Done")
            : [],
        };
      });
    }
  }, [filteredTasks, data?.projectId]);

  return { tasks, setTasks };
}
