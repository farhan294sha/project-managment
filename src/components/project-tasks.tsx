import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { TaskSection } from "./task-section";
import { useProject } from "~/hooks/use-project";
import { useDragAndDrop } from "~/hooks/use-dragDrop";
import ProjectTasksSkeleton from "./loading-skeleton/project-task-section";
import { useActiveProjectState } from "~/store/active-project";
import { useIsProjectTaskFecting } from "~/store/filters";

const ProjectTasks = () => {
  const { tasks, setTasks } = useProject();
  const { data } = useActiveProjectState();
  const { handleDragEnd } = useDragAndDrop(tasks, setTasks);
  const { data: isLoading } = useIsProjectTaskFecting(data?.projectId ?? "");

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
      <div className="flex-1  p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-max">
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
