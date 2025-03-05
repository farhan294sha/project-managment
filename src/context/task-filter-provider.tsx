import { TaskPriority, TaskStatus } from "@prisma/client";
import React, { createContext, ReactNode, useContext } from "react";
import { Task } from "~/components/task-card";
import { useTaskFilter } from "~/hooks/use-task-filter";
interface TaskFilterContextType {
  tasks: Task[];
  filteredTasks: Task[] | null | undefined;
  searchQuery: string | null | undefined;
  statusFilter: TaskStatus[];
  assigneeFilter: string[];
  priorityFilter: TaskPriority[];
  setSearchQuery: (search: string | null) => void;
  getTaskCountByStatus: (status: TaskStatus) => number | undefined;
  toggleStatusFilter: (status: TaskStatus) => void;
  toggleAssigneeFilter: (assignee: string) => void;
  togglePriorityFilter: (priority: TaskPriority) => void;
  resetFilters: () => void;
  updateTasks: (newTasks: Task[]) => void;
}
const TaskFilterContext = createContext<TaskFilterContextType | null>(null);

export function TaskFilterProvider({
  initialTasks,
  children,
}: {
  initialTasks: Task[] | undefined;
  children: ReactNode;
}) {
  const taskFilter = useTaskFilter(initialTasks);

  return (
    <TaskFilterContext.Provider value={taskFilter}>
      {children}
    </TaskFilterContext.Provider>
  );
}

export function useTaskFilterContext() {
  const context = useContext(TaskFilterContext);
  if (!context) {
    throw new Error(
      "useTaskFilterContext must be used within a TaskFilterProvider"
    );
  }
  return context;
}

// ... your existing useTaskFilter and useProject components
