import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { type Task } from "./task-card";
import { TaskSection } from "./task-section";

const ProjectTasks = () => {
  const [tasks, setTasks] = useState<{
    todo: Task[];
    onProgress: Task[];
    done: Task[];
  }>({
    todo: [
      {
        id: "1",
        title: "Design New UI",
        priority: "High",
        imageUrls: ["/task-image.jpg"],
        assignees: [{ avatar: "/placeholder.svg" }],
        comments: 5,
        files: 3,
      },
      {
        id: "3",
        title: "Design New UI",
        priority: "High",
        imageUrls: ["/task-image.jpg"],
        assignees: [{ avatar: "/placeholder.svg" }],
        comments: 5,
        files: 3,
      },
    ],
    onProgress: [
      {
        id: "2",
        title: "Onboarding Illustrations",
        priority: "Low",
        imageUrls: ["/task-image.jpg"],
        assignees: [{ avatar: "/placeholder.svg" }],
        comments: 14,
        files: 15,
      },
    ],
    done: [],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id;

      // section where task is located
      const fromSection = Object.keys(tasks).find((section) =>
        tasks[section as keyof typeof tasks].some(
          (task: Task) => task.id === taskId,
        ),
      );

      const toSection = over.id; // over id return the sectionId of task droped

      if (fromSection === toSection) {
        return;
      }

      if (fromSection && toSection) {
        // task that moved
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="row-span-3">
        <div className="grid grid-cols-3 gap-3">
          <TaskSection id="todo" variant="todo" tasks={tasks.todo} />
          <TaskSection
            id="onProgress"
            variant="onProgress"
            tasks={tasks.onProgress}
          />
          <TaskSection id="done" variant="done" tasks={tasks.done} />
        </div>
      </div>
    </DndContext>
  );
};
export default ProjectTasks;
