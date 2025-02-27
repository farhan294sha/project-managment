import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Edit, MoreHorizontalIcon, Trash } from "lucide-react";
import { useTaskDeleteAlert, useTaskDialoge } from "~/store/task-dialoge";

const DropdowncardMenu = ({ taskId }: { taskId: string }) => {
  const { setData } = useTaskDialoge(taskId, "UPDATE");
  const { setData: deleteAlert } =
    useTaskDeleteAlert(taskId);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-gray-500 hover:text-gray-900">
          <MoreHorizontalIcon className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 z-[1000]">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setData(true);
            }}
          >
            <Edit /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteAlert(true);
            }}
            className="text-destructive focus:text-destructive transition-all"
          >
            <>
              <Trash /> <span>Delete</span>
            </>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    </>
  );
};

export default DropdowncardMenu;
