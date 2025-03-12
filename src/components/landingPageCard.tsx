import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
interface LandingPageCardProps {
  date?: string; // Optional with default
  title?: string; // Optional with default
  assignedTo?: string; // Optional with default
  progress?: number; // Optional with default
  total?: number; // Optional with default
  photoUrl1?: string; // Optional
  photoUrl2?: string; // Optional
}

const LandingPageCard = ({
  date = "Unknown Date",
  title = "Untitled Task",
  assignedTo = "Unassigned",
  progress = 0,
  total = 0,
  photoUrl1,
  photoUrl2,
}: LandingPageCardProps) => {
  // Calculate progress percentage for the progress bar
  const progressPercentage = total === 0 ? 0 : (progress / total) * 100; // Handle division by zero

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 text-xs text-gray-500">{date}</div>
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="text-xs text-gray-500">Assigned to {assignedTo}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-1 text-xs">
            {progress}/{total}
          </span>
          <div className="h-1 w-16 rounded bg-gray-200">
            <div
              className="h-1 rounded bg-green-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex -space-x-1">
          <div className="h-6 w-6 rounded-full bg-gray-300 relative">
            {/* Replace with simple img if Avatar/AvatarImage are not available */}
            {photoUrl1 ? (
              <Avatar>
                <AvatarImage
                  src={photoUrl1}
                  alt="image"
                  className="rounded-full"
                />
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            )}
          </div>
          <div className="h-6 w-6 rounded-full bg-gray-400 relative">
            {/* Replace with simple img if Avatar/AvatarImage are not available */}
            {photoUrl2 ? (
              <Avatar>
                <AvatarImage
                  src={photoUrl2}
                  alt="image"
                  className="rounded-full"
                />
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-400"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageCard;
