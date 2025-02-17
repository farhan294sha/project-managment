import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/router";
import { AvatarGroup } from "./avatar-group";
import { ScrollAreaDemo } from "./selectMembers";
import { Member } from "~/utils/types";

interface AssigneeDisplayProps {
  onChange: (emails: string[]) => void;
}


export const AssigneeDisplay = ({onChange}: AssigneeDisplayProps) => {
  const router = useRouter();
  const projectId = router.asPath.split("/").slice(-1)[0] as string;
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  function handleAddedMebmbers(members: Member[]) {
    setShowAddMembers(false);
    setMembers(members)

    const emails = members.map((member)=> member.email || "")

    onChange(emails)
  }
  return (
    <>
      <div className="text-sm text-muted-foreground">Assignee</div>
      <div className="flex items-center gap-1">
        {members.length > 0 && (
          <AvatarGroup>
            {members.length >= 3 ? (
              <div className="flex items-center -space-x-2">
                {members.slice(0, 4).map((assignee, index) => (
                  <Avatar key={index} className="h-7 w-7">
                    <AvatarImage
                      src={assignee.image ?? undefined}
                      alt="Assignee"
                    />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {assignee.name && assignee.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Avatar className="flex h-8 w-8 items-center justify-center border-2 border-white bg-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    +{members.length - 4}
                  </span>
                </Avatar>
              </div>
            ) : (
              members.map((assignee, index) => (
                <Avatar key={index} className="h-7 w-7">
                  <AvatarImage
                    src={assignee.image ?? undefined}
                    alt="Assignee"
                  />
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {assignee.name && assignee.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))
            )}
          </AvatarGroup>
        )}
        <Button
          variant="purpleIcon"
          size="purpleIcon"
          className="h-6 w-6 rounded-full"
          onClick={() => setShowAddMembers(true)}
        >
          <Plus className="h-3 w-3 text-primary/70" />
        </Button>
        {showAddMembers && (
          <ScrollAreaDemo onSelectionChange={handleAddedMebmbers} />
        )}
      </div>
    </>
  );
};
