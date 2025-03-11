import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TaskDialoge from "./dialoges/task-dialoge";
import { useTaskSection } from "~/context/task-section-context";
import { useTaskDialoge } from "~/store/task-dialoge";

const AddTask = () => {
  const taskSection = useTaskSection();
  const { setData } = useTaskDialoge(taskSection ?? "", "CREATE");
  return (
    <>
      <Button
        variant={"purpleIcon"}
        size={"purpleIcon"}
        onClick={() => setData(true)}
      >
        <Plus className="h-4 w-4 text-primary/70" />
      </Button>
      <TaskDialoge taskType="CREATE" />
    </>
  );
};
export default AddTask;
