import Skeleton from "../ui/Skeleton";

function AccountCardSkeleton() {
  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-6 w-28 mb-3" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export default AccountCardSkeleton;