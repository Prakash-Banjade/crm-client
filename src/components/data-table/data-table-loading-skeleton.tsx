import { Skeleton } from "../ui/skeleton";

export default function DataTableLoadingSkeleton() {
    return (
        <div>
            <Skeleton className="h-9 mb-3 w-[210px]" />
            <Skeleton className="h-[200px]" />
        </div>
    )
}