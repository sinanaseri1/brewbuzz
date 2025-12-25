import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CoffeeCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden border-slate-200">
            {/* Image Placeholder */}
            <div className="aspect-square w-full bg-muted relative">
                <Skeleton className="h-full w-full" />
            </div>

            <CardContent className="p-4 flex-1 flex flex-col gap-3">
                {/* Title & Roaster */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" /> {/* Name */}
                    <Skeleton className="h-4 w-1/2" /> {/* Roaster */}
                </div>

                {/* Rating & Badge */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <Skeleton className="h-5 w-12 rounded" /> {/* Rating */}
                    <Skeleton className="h-5 w-16 rounded-full" /> {/* Roast Level */}
                </div>
            </CardContent>
        </Card>
    );
}