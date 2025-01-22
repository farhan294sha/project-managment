import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TaskDialoge from "./dialoges/task-dialoge";

const AddTask = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={"purpleIcon"}
        size={"purpleIcon"}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 text-primary/70" />
      </Button>
      <TaskDialoge open={open} setOpen={setOpen} />
    </>
  );
};
export default AddTask;
