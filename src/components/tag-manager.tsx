import { useState, ChangeEvent } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus } from "lucide-react"; // Assuming Plus icon is from lucide-react
import { Combobox } from "~/components/combobox"; // Custom Combobox component

export default function TagManager() {
  const [tags, setTags] = useState<string[]>([
    "Design",
    "Development",
    "Marketing",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // Handle adding a new tag
  const addTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    if (inputValue && !selectedTags.includes(inputValue)) {
      setSelectedTags([...selectedTags, inputValue]);
    }
    setInputValue("");
  };

  // Handle selecting a tag
  const selectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInputValue(""); // Clear the input after selection
  };

  // Handle removing a tag
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  console.log(tags.filter((tag) => !selectedTags.includes(tag)))
  console.log(tags)

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
        placeholder="Select an existing tag"
      />
    </div>
  );
}
