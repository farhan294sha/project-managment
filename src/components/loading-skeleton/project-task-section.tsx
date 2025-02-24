import { Skeleton } from "~/components/ui/skeleton"; // Adjust the import path as needed

const ProjectTasksSkeleton = () => {
  return (
    <div className="row-span-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksSkeleton;
