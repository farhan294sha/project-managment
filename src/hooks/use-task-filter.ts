import { TaskPriority, TaskStatus } from "@prisma/client";
import { useState, useEffect } from "react";
import { Task } from "~/components/task-card";
import { useFilterdTasks } from "~/store/filters";
import { useSearchQuery } from "~/store/search-store";

export function useTaskFilter(initialTasks: Task[] | undefined) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const { data: filteredTasks, setData: setFilteredTasks } = useFilterdTasks();
  const { data: searchQuery, setData: setSearchQuery } = useSearchQuery();
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([
    "Todo",
    "InProgress",
    "Done",
  ]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([
    "Low",
    "Medium",
    "High",
  ]);
  useEffect(() => {
    // handle initialTasks being undefined.
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  // Apply filters when any filter changes
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    let result = tasks;

    // Filter by search query
    if (searchQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter.length > 0) {
      result = result.filter((task) => statusFilter.includes(task.status));
    }

    // Filter by assignee
    if (assigneeFilter.length > 0) {
      result = result.filter((task) =>
        task.assignedTo.some((assignee) =>
          assigneeFilter.includes(assignee.name ?? "")
        )
      );
    }

    // Filter by priority
    if (priorityFilter.length > 0) {
      result = result.filter((task) => priorityFilter.includes(task.priority));
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, assigneeFilter, priorityFilter]);

  // Count tasks by status
  const getTaskCountByStatus = (status: TaskStatus) => {
    return filteredTasks?.filter((task) => task.status === status).length;
  };

  // Toggle status filter
  const toggleStatusFilter = (status: TaskStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Toggle assignee filter
  const toggleAssigneeFilter = (assignee: string) => {
    setAssigneeFilter((prev) =>
      prev.includes(assignee)
        ? prev.filter((a) => a !== assignee)
        : [...prev, assignee]
    );
  };

  // Toggle priority filter
  const togglePriorityFilter = (priority: TaskPriority) => {
    setPriorityFilter((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(["Todo", "InProgress", "Done"]);
    setAssigneeFilter([]);
    setPriorityFilter(["Low", "Medium", "High"]);
  };

  // Update tasks (e.g., after fetch or mutation)
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return {
    // States for consumption
    tasks,
    filteredTasks,
    searchQuery,
    statusFilter,
    assigneeFilter,
    priorityFilter,

    // State setters
    setSearchQuery,

    // Utility functions
    getTaskCountByStatus,
    toggleStatusFilter,
    toggleAssigneeFilter,
    togglePriorityFilter,
    resetFilters,
    updateTasks,
  };
}
