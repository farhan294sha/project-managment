import React from "react";
import { Button } from "./ui/button";
import { ChevronDown, Filter, Loader2, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import { useTaskFilterContext } from "~/context/task-filter-provider";
import { useActiveProjectState } from "~/store/active-project";
import { api } from "~/utils/api";

const TaskFilters = () => {
  const { data } = useActiveProjectState();

  const { data: members, isLoading } = api.project.getMembers.useQuery(
    { projectId: data?.projectId || "" },
    { enabled: !!data?.projectId }
  );
  const {
    statusFilter,
    toggleStatusFilter,
    priorityFilter,
    togglePriorityFilter,
    assigneeFilter,
    toggleAssigneeFilter,
  } = useTaskFilterContext();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={statusFilter.includes("Todo")}
            onCheckedChange={() => toggleStatusFilter("Todo")}
          >
            To-do
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter.includes("InProgress")}
            onCheckedChange={() => toggleStatusFilter("InProgress")}
          >
            On Progress
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter.includes("Done")}
            onCheckedChange={() => toggleStatusFilter("Done")}
          >
            Done
          </DropdownMenuCheckboxItem>

          <DropdownMenuLabel className="mt-2">
            Filter by Priority
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={priorityFilter.includes("Low")}
            onCheckedChange={() => togglePriorityFilter("Low")}
          >
            Low
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priorityFilter.includes("Medium")}
            onCheckedChange={() => togglePriorityFilter("Medium")}
          >
            Medium
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priorityFilter.includes("High")}
            onCheckedChange={() => togglePriorityFilter("High")}
          >
            High
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            Assignee
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isLoading ? (
            members &&
            members?.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={assigneeFilter.includes(user.name ?? "")}
                onCheckedChange={() => toggleAssigneeFilter(user.name ?? "")}
              >
                {user.name}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TaskFilters;
