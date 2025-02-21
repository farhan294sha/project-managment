"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { MoreHorizontal, MessageCircle, File } from "lucide-react";
import Image from "next/image";
import { AvatarGroup } from "./avatar-group";
import { TaskPriority, TaskStatus } from "@prisma/client";
import TaskDialoge from "./dialoges/task-dialoge";
import PriorityDisplay from "./priority-display";
import { useState } from "react";
export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  imageUrls: string[];
  status: TaskStatus;
  assignedTo: { image: string | null }[];
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [openDiplayTask, setOpenDiplayTask] = useState(false);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  console.log("TASKCARD TASKID:", id);

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="space-y-3 p-4"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDiplayTask(true);
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <PriorityDisplay priority={priority} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="h-5 w-5" />
          </button>
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
      {console.log("TASK ID RIGHT BEVFOR RENDER", id)}
      {openDiplayTask && (
        <TaskDialoge
          open={openDiplayTask}
          setOpen={setOpenDiplayTask}
          dialogType="display"
          selectedTaskId={id}
          taskTitle={title}
        />
      )}
    </>
  );
}
