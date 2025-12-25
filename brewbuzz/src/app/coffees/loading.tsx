import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { CoffeeCardSkeleton } from "@/components/coffee-card-skeleton";
import { LoadingBean } from "@/components/ui/loading-bean"; // Import needed

export default function Loading() {
    return (
        // Add 'relative' to the main container
        <div className="min-h-screen bg-background relative">
            <Navbar />

            {/* The Wiggling Bean Overlay */}
            <div className="absolute inset-0 top-16 flex items-center justify-center z-10 pointer-events-none">
                <LoadingBean size={48} />
            </div>

            {/* Add opacity-40 to fade the skeletons slightly */}
            <main className="container py-10 opacity-40 transition-opacity">
                {/* Title Skeleton */}
                <Skeleton className="h-10 w-64 mb-8" />

                {/* Search Bar Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-12 w-full max-w-lg rounded-md" />
                </div>

                {/* Grid of Skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CoffeeCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}