import {
  useState,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { api } from "~/utils/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, Loader2 } from "lucide-react";

type ProjectCreateProps = {
  setError: Dispatch<SetStateAction<string>>;
  setShowInput: Dispatch<SetStateAction<boolean>>;
  ref: MutableRefObject<HTMLInputElement | null>;
};

const ProjectCreateInput = ({
  setShowInput,
  setError,
  ref: inputRef,
}: ProjectCreateProps) => {
  const utils = api.useUtils();
  const [projectName, setProjectName] = useState("");

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();

      setProjectName("");

      setShowInput(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createProjectMutation.mutate({ title: projectName });
    }
  };
  return (
    <div className="relative flex">
      <Input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter your project name"
      />
      <Button
        className="absolute right-0 top-[2px]"
        variant={"ghost"}
        size={"sm"}
        onClick={() => setShowInput(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      {createProjectMutation.isPending && (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-primary/50" />
        </div>
      )}
    </div>
  );
};
export default ProjectCreateInput;
