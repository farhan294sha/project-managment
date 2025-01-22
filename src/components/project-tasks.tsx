import { DndContext } from "@dnd-kit/core";
import { TaskSection } from "./task-section";
import { useProject } from "~/hooks/use-project";
import { useDragAndDrop } from "~/hooks/use-dragDrop";

const ProjectTasks = ({ projectId }: { projectId: string }) => {
  const { tasks, setTasks } = useProject(projectId);
  const { handleDragEnd } = useDragAndDrop(tasks, setTasks);

  if (projectId === "NONE") {
    return null;
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="row-span-3">
        <div className="grid grid-cols-3 gap-3">
          <TaskSection id="todo" variant="todo" tasks={tasks.todo} />
          <TaskSection
            id="onProgress"
            variant="onProgress"
            tasks={tasks.onProgress}
          />
          <TaskSection id="done" variant="done" tasks={tasks.done} />
        </div>
      </div>
    </DndContext>
  );
};
export default ProjectTasks;
