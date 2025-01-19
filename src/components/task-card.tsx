"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { MoreHorizontal, MessageCircle, File } from "lucide-react";
import Image from "next/image";
import { AvatarGroup } from "./avatar-group";
export type Task = {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  imageUrls: string[];
  assignees: { avatar: string }[];
  comments: number;
  files: number;
};

type TaskCardProps = Task;

export function TaskCard({
  id,
  title,
  priority,
  imageUrls,
  assignees,
  comments,
  files,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Define priority color scheme
  const priorityStyles = {
    Low: {
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    Medium: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    High: {
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="space-y-3 p-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          {/* Priority badge with dynamic styles */}
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[priority].bgColor} ${priorityStyles[priority].textColor}`}
          >
            {priority}
          </span>
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
          {assignees.map((assignee, index) => (
            <Avatar key={index} className="h-8 w-8 border-2 border-white">
              <AvatarImage src={assignee.avatar} alt="Assignee" />
            </Avatar>
          ))}
        </AvatarGroup>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <File className="h-4 w-4" />
            <span>{files} files</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
