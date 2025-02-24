import React from 'react';
import { Skeleton } from "~/components/ui/skeleton";

const ProjectHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Project Name Skeleton */}
      <div className="flex items-center">
        <Skeleton className="h-8 w-48 mr-4" /> 
        <Skeleton className="h-6 w-6 rounded-full mr-2" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Invite/Filter/Today Skeletons */}
      <div className="flex items-center">
        <Skeleton className="h-8 w-24 mr-4 rounded-full" /> 
        <Skeleton className="h-8 w-8 mr-2 rounded-full" />
        <Skeleton className="h-8 w-8 mr-4 rounded-full" />
        <Skeleton className="h-8 w-20 mr-4 rounded-full" /> 
        <Skeleton className="h-8 w-20 rounded-full" /> 
      </div>
    </div>
  );
};

export default ProjectHeaderSkeleton;