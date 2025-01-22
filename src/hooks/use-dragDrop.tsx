import { DragEndEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";
import { Task } from "~/components/task-card";

type Tasks = {
  todo: Task[];
  onProgress: Task[];
  done: Task[];
};
export const useDragAndDrop = (
  tasks: Tasks,
  setTasks: Dispatch<SetStateAction<Tasks>>,
) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id;

      // Section where task is located
      const fromSection = Object.keys(tasks).find((section) =>
        tasks[section as keyof typeof tasks].some(
          (task: Task) => task.id === taskId,
        ),
      );

      const toSection = over.id; // over.id returns the sectionId of the task dropped

      if (fromSection === toSection) {
        return;
      }

      if (fromSection && toSection) {
        // Task that was moved
        const task = tasks[fromSection as keyof typeof tasks].find(
          (task) => task.id === taskId,
        );
        if (task) {
          setTasks((prev) => ({
            ...prev,
            [fromSection]: prev[fromSection as keyof typeof tasks].filter(
              (t) => t.id !== taskId,
            ),
            [toSection]: [...prev[toSection as keyof typeof tasks], task],
          }));
        }
      }
    }
  };

  return { handleDragEnd };
};
