"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { CalendarIcon, ChevronDown, Plus } from "lucide-react";
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
        <TaskForm onSave={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
