import React, { useState } from "react";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import { useActiveProjectState } from "~/store/active-project";
import { Input } from "./ui/input";
import { api } from "~/utils/api";

const ProjectTitle = ({ projectName }: { projectName: string }) => {
  const qureyClient = api.useUtils();
  const { data: projectId } = useActiveProjectState();
  const updateTitleMut = api.project.updateTitle.useMutation({
    onSuccess(data, variables) {
      qureyClient.project.getbyId.setData(
        { id: variables.projectId },
        (old) => {
          if (old) {
            return { ...old, name: variables.title };
          }
          return old;
        }
      );
    },
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(projectName || "");

  const handleEditClick = () => {
    setIsEditingTitle(true);
    setNewTitle(projectName); // Set initial value to current project name
  };

  const handleSaveClick = async () => {
    try {
      if (projectId?.projectId) {
        await updateTitleMut.mutateAsync({
          projectId: projectId.projectId,
          title: newTitle,
        });
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error("Error updating title:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  const handleCancelClick = () => {
    setIsEditingTitle(false);
  };

  return (
    <>
      {isEditingTitle ? (
        <div className="flex items-center gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button size="sm" onClick={handleSaveClick}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
            {projectName}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="purpleIcon"
              size="purpleIcon"
              onClick={handleEditClick}
            >
              <SquarePen className="h-4 w-4 text-primary/90" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectTitle;
