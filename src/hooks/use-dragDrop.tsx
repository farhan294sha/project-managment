import { DragEndEvent } from "@dnd-kit/core";
import { TaskStatus } from "@prisma/client";
import { Dispatch, SetStateAction} from "react";
import { Task } from "~/components/task-card";
import { api } from "~/utils/api";
import { useToast } from "./use-toast";

type Tasks = {
  todo: Task[];
  onProgress: Task[];
  done: Task[];
};
export const useDragAndDrop = (
  tasks: Tasks,
  setTasks: Dispatch<SetStateAction<Tasks>>
) => {
  const qureyClient = api.useUtils();
  const { toast } = useToast();

  const updateTaskMutation = api.task.updateTaskStatus.useMutation({
    onSuccess(data) {
      qureyClient.task.getTask.invalidate({
        projectId: data.projectId ?? "",
      });
    },
    onError(error) {
      toast({ title: "Something went wrong", description: error.message });
      console.log(error);
    },
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id;

      // Section where task is located
      const fromSection = Object.keys(tasks).find((section) =>
        tasks[section as keyof typeof tasks].some(
          (task: Task) => task.id === taskId
        )
      );

      const toSection = over.id;

      if (fromSection === toSection) {
        return;
      }

      if (fromSection && toSection) {
        try {
          updateTaskMutation.mutate({
            taskId: taskId.toString(),
            status: handileTaskEnum(toSection.toString()),
          });
        } catch (error) {
          console.log(error);
        }

        const task = tasks[fromSection as keyof typeof tasks].find(
          (task) => task.id === taskId
        );
        if (task) {
          setTasks((prev) => ({
            ...prev,
            [fromSection]: prev[fromSection as keyof typeof tasks].filter(
              (t) => t.id !== taskId
            ),
            [toSection]: [...prev[toSection as keyof typeof tasks], task],
          }));
        }
      }
    }
  };

  return { handleDragEnd };
};

function handileTaskEnum(toSection: string): TaskStatus {
  switch (toSection) {
    case "todo":
      return "Todo";
      break;
    case "onProgress":
      return "InProgress";
      break;
    case "done":
      return "Done";
      break;
    default:
      return "Todo";
      break;
  }
}
