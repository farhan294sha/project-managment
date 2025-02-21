import { TaskPriority } from "@prisma/client";
import React from "react";
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

const PriorityDisplay = ({ priority }: { priority: TaskPriority }) => {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[priority].bgColor} ${priorityStyles[priority].textColor}`}
    >
      {priority}
    </span>
  );
};

export default PriorityDisplay;
