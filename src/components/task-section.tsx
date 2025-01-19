"use client";

import { useDroppable } from "@dnd-kit/core";
import { type Task, TaskCard } from "./task-card";

export type TaskSectionVariant = "todo" | "onProgress" | "done";
export type TaskSection = {
  id: string;
  variant: TaskSectionVariant;
  tasks: Task[];
};
type TaskSectionProps = TaskSection;

export function TaskSection({ id, variant, tasks }: TaskSectionProps) {
  const { setNodeRef } = useDroppable({ id });

  // Define section styles based on the variant
  const sectionConfig = {
    todo: {
      title: "To-do",
      color: "bg-blue-400",
    },
    onProgress: {
      title: "On Progress",
      color: "bg-orange-400",
    },
    done: {
      title: "Done",
      color: "bg-green-400",
    },
  };

  const { title, color } = sectionConfig[variant];

  return (
    <div ref={setNodeRef} className="min-h-screen rounded-xl bg-accent p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-sm">
            {tasks.length}
          </span>
        </div>
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}
