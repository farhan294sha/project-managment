import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const TaskDetailSkeleton = () => {
  return (
    <div className="h-full space-y-6">
      <div className="grid h-full grid-cols-1 md:grid-cols-5 overflow-hidden">
        <div className="col-span-3 space-y-2 p-6 overflow-auto h-full">
          <div className="space-y-2">
            <Skeleton className="text-3xl font-medium h-8 w-48" />
          </div>

          <div className="space-y-2 pt-2 pl-2">
            <Skeleton className="text-muted-foreground h-4 w-full" />
            <Skeleton className="text-muted-foreground h-4 w-3/4" />
            <Skeleton className="text-muted-foreground h-4 w-1/2" />
          </div>

          <div className="mt-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </div>

        <div className="col-span-2 overflow-auto h-full">
          <div className="space-y-6 bg-accent/50 p-6 w-full h-full">
            <div className="space-y-2">
              <Skeleton className="text-sm text-muted-foreground h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="text-sm h-6 w-32" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="text-sm text-muted-foreground h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>

            <div className="space-y-2">
              <Skeleton className="text-sm text-muted-foreground h-4 w-24" />
              <Skeleton className="text-sm h-6 w-32" />
            </div>

            <div className="space-y-2">
              <Skeleton className="text-sm text-muted-foreground h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="text-sm text-muted-foreground h-4 w-24" />
              <div className="space-x-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex flex-col gap-2 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="text-xs text-muted-foreground h-4 w-48" />
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="text-xs text-muted-foreground h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailSkeleton;
