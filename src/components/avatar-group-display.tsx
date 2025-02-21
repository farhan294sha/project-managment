import React from "react";
import { AvatarGroup } from "./avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Member } from "~/utils/types";

const AvatarGroupDisplay = ({ members }: { members: Member[] }) => {
  return (
    <div>
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
                <AvatarImage src={assignee.image ?? undefined} alt="Assignee" />
                <AvatarFallback className="bg-primary/10 text-xs">
                  {assignee.name && assignee.name[0]}
                </AvatarFallback>
              </Avatar>
            ))
          )}
        </AvatarGroup>
      )}
    </div>
  );
};

export default AvatarGroupDisplay;
