import { Skeleton } from "@/components/ui/skeleton";

function PostsSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-3 p-6">
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
    </div>
  );
}

export default PostsSkeleton;
