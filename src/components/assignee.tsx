import { Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { AvatarGroup } from "./avatar-group";
import { ScrollAreaDemo } from "./selectMembers";
import { Member } from "~/utils/types";
import AvatarGroupDisplay from "./avatar-group-display";

interface AssigneeDisplayProps {
  onChange: (emails: string[]) => void;
  assignedTo?: Member[];
}

export const AssigneeDisplay = ({
  onChange,
  assignedTo,
}: AssigneeDisplayProps) => {
  // const router = useRouter();
  // const projectId = router.asPath.split("/").slice(-1)[0] as string;
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  function handleAddedMebmbers(members: Member[]) {
    setShowAddMembers(false);
    setMembers(members);

    const emails = members.map((member) => member.email || "");

    onChange(emails);
  }

  useEffect(() => {
    if (assignedTo) {
      setMembers(assignedTo);
    }
  }, [assignedTo]);
  return (
    <>
      <div className="text-sm text-muted-foreground">Assignee</div>
      <div className="flex items-center gap-1">
        <AvatarGroupDisplay members={members} />
        <Button
          type="button"
          variant="purpleIcon"
          size="purpleIcon"
          className="h-6 w-6 rounded-full"
          onClick={() => setShowAddMembers(true)}
        >
          <Plus className="h-3 w-3 text-primary/70" />
        </Button>
        {showAddMembers && (
          <div className="relative">
            <ScrollAreaDemo onSelectionChange={handleAddedMebmbers} />
            <Button
              type="button"
              onClick={() => setShowAddMembers(false)}
              variant={"ghost"}
              size={"icon"}
              className="absolute top-1 right-2"
            >
              <X />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
