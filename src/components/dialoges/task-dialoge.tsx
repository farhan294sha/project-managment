"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { Dispatch, SetStateAction } from "react";
import TaskForm from "../forms/add-task-form";

type DialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TaskDialoge({ open, setOpen }: DialogProps) {
  function handleSubmit() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl gap-0 p-0 font-sans">
        <DialogHeader className="border-b p-4">
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Your Projects / Wiscraft / In progress
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {/* TASK FORM */}
        {/* <TaskFormUpdate /> */}
        <TaskForm onSave={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
