import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";
import { useTaskSection } from "~/context/task-section-context";
import { Skeleton } from "../ui/skeleton";
import { useActiveProjectState } from "~/store/active-project";
import { useTaskDialoge } from "~/store/task-dialoge";
import TaskContent from "../task-content";

type DialogProps = {
  selectedTaskId?: string;
  taskTitle?: string;
  taskType: "UPDATE" | "DISPLAY" | "CREATE";
};

export default function TaskDialoge({
  selectedTaskId,
  taskType,
  taskTitle,
}: DialogProps) {
  const taskSection = useTaskSection();
  const qureyClient = api.useUtils();

  const { data: projectId } = useActiveProjectState();
  const { data, setData } = useTaskDialoge(
    taskType === "CREATE" ? taskSection : (selectedTaskId ?? ""),
    taskType,
  );
  if (!data) {
    return null;
  }
  const project = qureyClient.project.getbyId.getData({
    id: projectId?.projectId ?? "",
  });

  return (
    <Dialog open={data} onOpenChange={setData}>
      <DialogContent className="max-w-5xl gap-0 p-0 font-sans h-[80%] overflow-hidden flex flex-col">
        <DialogHeader className="border-b p-4 max-h-16">
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {project ? (
                  `${project?.name}/${taskSection}/${taskTitle}`
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <TaskContent taskType={taskType} taskId={selectedTaskId} />
      </DialogContent>
    </Dialog>
  );
}
