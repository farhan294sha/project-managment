import React from "react";
import DisplayTask from "./dialoges/display-task";
import TaskForm from "./forms/add-task-form";
import UpdateTask from "./forms/update-task";
import { useTaskDialoge } from "~/store/task-dialoge";
import { useTaskSection } from "~/context/task-section-context";

const TaskContent = ({
  taskType,
  taskId,
}: {
  taskType: "UPDATE" | "DISPLAY" | "CREATE";
  taskId?: string;
}) => {
  const taskSection = useTaskSection();
  const dialogeOpen = useTaskDialoge(
    taskType === "CREATE" ? taskSection : (taskId ?? ""),
    taskType,
  );

  switch (taskType) {
    case "DISPLAY":
      return <DisplayTask taskId={taskId ?? ""} />;
    case "UPDATE":
      return (
        <UpdateTask
          taskId={taskId ?? ""}
          onSave={() => {
            dialogeOpen.setData(false);
          }}
        />
      );
    case "CREATE":
      return (
        <TaskForm
          onSave={() => {
            dialogeOpen.setData(false);
          }}
        />
      );
    default:
      return <div>Unknown Task Type</div>;
  }
};

export default TaskContent;
