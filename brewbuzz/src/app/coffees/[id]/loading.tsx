import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBean } from "@/components/ui/loading-bean"; // Import needed

export default function Loading() {
    return (
        // Add 'relative'
        <div className="min-h-screen bg-background pb-20 relative">
            <Navbar />

            {/* The Wiggling Bean Overlay */}
            <div className="absolute inset-0 top-16 flex items-center justify-center z-10 pointer-events-none">
                <LoadingBean size={48} />
            </div>

            {/* Add opacity-40 */}
            <main className="container py-10 opacity-40 transition-opacity">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left: Image Skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                    </div>

                    {/* Right: Text Details */}
                    <div className="space-y-8">
                        {/* ... existing skeletons ... */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-12 w-3/4 mb-4" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>

                        <div className="py-6 border-y border-slate-100">
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}