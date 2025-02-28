import { useState, useEffect } from "react";
import { Task } from "~/components/task-card";
import { useTaskFilterContext } from "~/context/task-filter-provider";

export function useProject() {
  const { filteredTasks } = useTaskFilterContext();

  const [tasks, setTasks] = useState<{
    todo: Task[];
    onProgress: Task[];
    done: Task[];
  }>({
    todo: [],
    onProgress: [],
    done: [],
  });

  console.log("Filtered task", filteredTasks);

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
  }, [filteredTasks]);

  return { tasks, setTasks,};
}
