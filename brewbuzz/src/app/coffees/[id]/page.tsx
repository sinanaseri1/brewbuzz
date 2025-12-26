import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, User, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { ReviewModal } from "@/components/review-modal";
import Link from "next/link";

export default async function CoffeeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const [coffeeResult, reviewsResult] = await Promise.all([
        supabase.from("coffees").select("*, roasters(*)").eq("id", id).single(),
        supabase.from("reviews").select("*").eq("coffee_id", id).order("created_at", { ascending: false }),
    ]);

    const { data: coffee, error } = coffeeResult;
    const reviews = reviewsResult.data || [];

    if (error || !coffee) notFound();

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <main className="container py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        {/* SAFE IMAGE RENDERING */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted shadow-sm flex items-center justify-center">
                            {coffee.image_url ? (
                                <Image
                                    src={coffee.image_url}
                                    alt={coffee.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground/50">
                                    <Coffee className="h-20 w-20 mb-2" />
                                    <span className="text-sm font-medium">No image available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            {/* NEW: Link to Roaster Page */}
                            <Link
                                href={`/roasters/${coffee.roaster_id}`}
                                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                                {coffee.roasters.name}
                            </Link>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {coffee.roasters.country || "Unknown Origin"}
                            </span>
                        </div>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-4 py-6 border-y">
                            <div className="text-4xl font-bold font-serif">{averageRating.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-2xl font-bold">Reviews</h3>
                                <ReviewModal coffeeId={id} />
                            </div>

                            {reviews.length === 0 ? (
                                <p className="text-muted-foreground">No reviews yet.</p>
                            ) : (
                                <div className="grid gap-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-4 border rounded-lg bg-card">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs flex gap-1">
                                                        {review.rating} <Star className="h-3 w-3 fill-current" />
                                                    </Badge>
                                                    <span className="font-semibold text-sm">Verified User</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{review.body}</p>

                                            {/* Flavor Tags if they exist */}
                                            {review.flavor_tags && review.flavor_tags.length > 0 && (
                                                <div className="flex gap-2 mt-3">
                                                    {review.flavor_tags.map((tag: string) => (
                                                        <Badge key={tag} variant="outline" className="text-[10px] font-normal text-muted-foreground">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}