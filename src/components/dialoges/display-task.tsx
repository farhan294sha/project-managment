import React from "react";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { Button } from "react-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AvatarGroupDisplay from "../avatar-group-display";
import { Badge } from "../ui/badge";
import PriorityDisplay from "../priority-display";
import TaskComments from "../task-comments";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import TaskDetailSkeleton from "../loading-skeleton/task-display";

const DisplayTask = ({ taskId }: { taskId: string }) => {
  const { toast } = useToast();
  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = api.task.getbyId.useQuery(
    { taskId: taskId! },
    {
      enabled: !!taskId,
    }
  );

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (isError) {
    toast({ title: "Something went wrong" });
    return <Button onClick={() => refetch()}>Try again</Button>;
  }
  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="h-full space-y-6">
      <div className="grid h-full grid-cols-1 md:grid-cols-5 overflow-hidden">
        <div className="col-span-3 space-y-2 p-6 overflow-auto h-full">
          <div className="space-y-2">
            <div className="text-3xl font-medium">{task.title}</div>
          </div>

          <div className="space-y-2 pt-2 pl-2">
            <div className="text-muted-foreground">{task.description}</div>
          </div>
          <div className="mt-2">
            <Accordion type="single" collapsible>
              <AccordionItem value="comments">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex gap-2">
                    <div>Comments</div>
                    <span className="text-muted-foreground">2</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <TaskComments />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="col-span-2 overflow-auto h-full">
          <div className="space-y-6 bg-accent/50 p-6 w-full h-full">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Created by</div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={
                      task.createdBy.image
                        ? task.createdBy.image
                        : "./placeholder"
                    }
                  />
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {task.createdBy.name && task.createdBy.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.createdBy.name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Assignee</div>
              <AvatarGroupDisplay members={task.assignedTo} />
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="text-sm">
                {task.deadline ? new Date(task.deadline).toDateString() : "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Priority</div>
              <div>
                <PriorityDisplay priority={task.priority} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Tags</div>
              <div className="space-x-1">
                {task.tags.map((tag) => {
                  return <Badge key={tag.id}>{tag.name}</Badge>;
                })}
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex flex-col gap-2 text-sm">
                <span>Created</span>
                <span className="text-xs text-muted-foreground">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span>Updated</span>
                <span className="text-xs text-muted-foreground">
                  {task.updatedAt
                    ? new Date(task.updatedAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayTask;
