import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { Dispatch, SetStateAction } from "react";
import TaskForm from "../forms/add-task-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useTaskSection } from "~/context/task-section-context";
import { Skeleton } from "../ui/skeleton";

type DialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TaskDialoge({ open, setOpen }: DialogProps) {
  const router = useRouter();
  const taskSection = useTaskSection();
  const projectId = router.query.projects as string;
  const project = api.project.getbyId.useQuery(
    { id: projectId },
    {
      enabled: !!projectId,
    }
  );
  function handleSubmit() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl gap-0 p-0 font-sans h-[80%] overflow-hidden flex flex-col">
        <DialogHeader className="border-b p-4 max-h-16">
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {project.isLoading ? (
                  <Skeleton />
                ) : (
                  `${project.data?.name}/${taskSection}`
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {/* TASK FORM */}
        {/* <TaskFormUpdate /> */}
        {/* <DisplayTask/> */}
        <TaskForm onSave={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
