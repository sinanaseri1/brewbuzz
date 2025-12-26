import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingBean } from "@/components/ui/loading-bean";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50/50 relative">
            <Navbar />

            {/* Loading Bean Overlay */}
            <div className="absolute inset-0 top-16 flex items-center justify-center z-10 pointer-events-none">
                <LoadingBean size={48} />
            </div>

            <div className="opacity-40">
                {/* Header Skeleton */}
                <div className="bg-white border-b">
                    <div className="container py-16 flex items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-2xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <main className="container py-12">
                    <Skeleton className="h-8 w-48 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-80 w-full rounded-xl" />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}