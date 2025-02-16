import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Checkbox } from "~/components/ui/checkbox";
import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { Member } from "~/utils/types";



interface ScrollAreaDemoProps {
  onSelectionChange: (selectedMembers: Member[]) => void;
}

export function ScrollAreaDemo({ onSelectionChange }: ScrollAreaDemoProps) {
  const router = useRouter();
  const projectId = router.asPath.split("/").slice(-1)[0] as string;
  const { data: members, isLoading } = api.project.getMembers.useQuery(
    { projectId },
    { enabled: !!projectId }
  );
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([]);

  const toggleMember = (member: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((prevMember) => prevMember.id === member.id);

      const newSelection = isSelected
        ? prev.filter((prevMember) => prevMember.id !== member.id)
        : [...prev, member];

      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  return (
    <ScrollArea className="h-72 w-80 rounded-md border">
      <div className="p-4">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <h4 className="mb-4 text-sm font-medium leading-none">
              Select Members ({selectedMembers.length} selected)
            </h4>
            {members?.map((member) => (
              <React.Fragment key={member.id}>
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id={member.id}
                    checked={selectedMembers.some((selectedMem)=> selectedMem.id === member.id)}
                    onCheckedChange={() => toggleMember(member)}
                  />
                  <div>
                    <label
                      htmlFor={member.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {member.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
