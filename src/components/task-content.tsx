import React from "react";
import DisplayTask from "./dialoges/display-task";
import TaskForm from "./forms/add-task-form";
import UpdateTask from "./forms/update-task";
import { useTaskDialoge } from "~/store/task-dialoge";

const TaskContent = ({
  taskType,
  taskId,
}: {
  taskType: "UPDATE" | "DISPLAY" | "CREATE";
  taskId?: string;
}) => {
  const dialogeOpen = useTaskDialoge(taskId ?? "", taskType);

  switch (taskType) {
    case "DISPLAY":
      return <DisplayTask taskId={taskId ?? ""}/>;
    case "UPDATE":
      return <UpdateTask taskId={taskId ?? ""} onSave={()=> {}} />;
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
