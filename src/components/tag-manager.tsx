import { useState, ChangeEvent, useEffect } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus } from "lucide-react"; // Assuming Plus icon is from lucide-react
import { Combobox } from "~/components/combobox"; // Custom Combobox component
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useToast } from "~/hooks/use-toast";

interface TagManagerProps {
  onChange: (tags: string[]) => void;
}

export default function TagManager({ onChange }: TagManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const apiClient = api.useUtils();
  const projectId = router.query.projects as string;
  const {
    data: projectTags,
    isLoading,
    isError,
  } = api.project.getTags.useQuery(
    { projectId: projectId },
    { enabled: !!projectId }
  );

  const createTagMut = api.project.updateTags.useMutation({
    async onSuccess() {
      await apiClient.project.getTags.invalidate({ projectId: projectId });
    },
    onError(error, variables, context) {
      toast({ title: error.shape?.message });
    },
  });

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // Handle adding a new tag
  const addTag = async () => {
    if (inputValue && !tags.includes(inputValue)) {
      try {
        await createTagMut.mutateAsync({
          projectId,
          tags: [...tags, inputValue],
        });
      } catch (error) {
        console.error("Cannot create tag");
        return;
      }
    }
    if (inputValue && !selectedTags.includes(inputValue)) {
      console.log("ADD TAG");
      setSelectedTags([...selectedTags, inputValue]);
      onChange([...selectedTags, inputValue]);
    }
    setInputValue("");
  };

  // Handle selecting a tag
  const selectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      onChange([...selectedTags, tag]);
    }
    setInputValue(""); // Clear the input after selection
  };

  // Handle removing a tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    onChange(selectedTags.filter((t) => t !== tag));
  };

  useEffect(() => {
    if (projectTags) {
      setTags(projectTags.map((tag) => tag.name));
    }
  }, [projectTags]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeTag(tag)}
              className="ml-1 p-0 text-xs"
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>

      {/* Tag Input Field */}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          placeholder="Enter new tag"
        />
        <Button variant="outline" size="sm" onClick={addTag} type="button">
          <Plus className="h-4 w-4" />
          Add tag
        </Button>
      </div>

      {/* Combobox for selecting existing tags */}
      <Combobox
        onChange={selectTag}
        options={tags.filter((tag) => !selectedTags.includes(tag))}
        isLoading={isLoading}
      />
      {createTagMut.isError && (
        <p className="text-red-500">{createTagMut.failureReason?.message}</p>
      )}
    </div>
  );
}
