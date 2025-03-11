import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useActiveProjectState } from "~/store/active-project";
import { useTaskDeleteAlert } from "~/store/task-dialoge";
import { api } from "~/utils/api";

export function DeleteTaskAlertDialoge({ taskId }: { taskId: string }) {
  const { data: projectId } = useActiveProjectState();
  const qureyClient = api.useUtils();
  const { data, setData } = useTaskDeleteAlert(taskId);
  const [isDeleteButtonClicked, setIsDeleteButtonClicked] = useState(false);
  const deleteMutation = api.task.delete.useMutation({
    async onSuccess() {
      await qureyClient.task.getTask.invalidate({
        projectId: projectId?.projectId ?? "",
      });

      setData(false);
    },
  });
  return (
    <AlertDialog
      open={data ?? false}
      onOpenChange={(change) => {
        if (deleteMutation.isPending) {
          return;
        }
        if (isDeleteButtonClicked) {
          setData(change);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              setData(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteMutation.isPending}
            onClick={async (e) => {
              e.stopPropagation();
              setIsDeleteButtonClicked(true);
              try {
                await deleteMutation.mutateAsync({ taskId: taskId });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
