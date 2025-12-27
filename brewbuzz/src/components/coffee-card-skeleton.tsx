import { Skeleton } from "@/components/ui/skeleton";

export function CoffeeCardSkeleton() {
    return (
        <div className="h-full flex flex-col border border-border bg-white">
            <div className="aspect-[4/3] w-full bg-secondary relative border-b border-border">
                <Skeleton className="h-full w-full rounded-none" />
            </div>
            <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 rounded-none" />
                </div>
                <div>
                    <Skeleton className="h-6 w-3/4 mb-2 rounded-none" />
                    <Skeleton className="h-4 w-1/2 rounded-none" />
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                    <Skeleton className="h-3 w-full rounded-none" />
                </div>
            </div>
        </div>
    );
}