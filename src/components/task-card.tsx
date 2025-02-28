"use client";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { MessageCircle, File, GripHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { AvatarGroup } from "./avatar-group";
import { TaskPriority, TaskStatus } from "@prisma/client";
import TaskDialoge from "./dialoges/task-dialoge";
import PriorityDisplay from "./priority-display";
import { cn } from "~/lib/utils";
import DropdowncardMenu from "./dropdown-card";
import { useTaskDeleteAlert, useTaskDialoge } from "~/store/task-dialoge";
import { DeleteTaskAlertDialoge } from "./task-delete-dialoge";
export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  imageUrls: string[];
  status: TaskStatus;
  assignedTo: { image: string | null; name: string | null }[];
  _count: {
    comments: number;
    files: number;
  };
};

type TaskCardProps = Task;

export function TaskCard({
  id,
  title,
  priority,
  imageUrls,
  assignedTo,
  _count,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const { data: openDiplayTask, setData: setOpenDiplayTask } = useTaskDialoge(
    id,
    "DISPLAY"
  );
  const { data: showUpdateTask } = useTaskDialoge(id, "UPDATE");

  const { data: isDeleteAlertOpen } = useTaskDeleteAlert(id);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "space-y-3 p-4",
          "hover:shadow-xl hover:shadow-zinc-500/20 dark:hover:shadow-zinc-900/20",
          "transition-shadow",
          "relative",
          "group",
          "hover:cursor-pointer"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDiplayTask(true);
        }}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "absolute top-16 right-4",
            "text-muted-foreground",
            "opacity-0",
            "group-hover:opacity-100",
            "transition-all",
            "hover:cursor-grab",
            {
              "hover:cursor-grabbing": isDragging,
            }
          )}
        >
          <GripHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <PriorityDisplay priority={priority} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
        <div className="absolute top-2 right-4">
          <DropdowncardMenu taskId={id} />
          {isDeleteAlertOpen && <DeleteTaskAlertDialoge taskId={id} />}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`Task preview ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <AvatarGroup>
            {assignedTo.map((assignee, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-white">
                <AvatarImage src={assignee.image ?? undefined} alt="Assignee" />
              </Avatar>
            ))}
          </AvatarGroup>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            {_count.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{_count.comments} comments</span>
              </div>
            )}
            {_count.files > 0 && (
              <div className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span>{_count.files} files</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      {showUpdateTask && (
        <TaskDialoge taskType="UPDATE" selectedTaskId={id} taskTitle={title} />
      )}
      {openDiplayTask && (
        <TaskDialoge taskType="DISPLAY" selectedTaskId={id} taskTitle={title} />
      )}
    </>
  );
}
