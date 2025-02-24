import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { TaskSection } from "./task-section";
import { useProject } from "~/hooks/use-project";
import { useDragAndDrop } from "~/hooks/use-dragDrop";
import ProjectTasksSkeleton from "./loading-skeleton/project-task-section";

const ProjectTasks = () => {
  const { tasks, setTasks, isLoading } = useProject();
  const { handleDragEnd } = useDragAndDrop(tasks, setTasks);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 10 },
    })
  );
  if (isLoading) {
    return <ProjectTasksSkeleton />;
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
