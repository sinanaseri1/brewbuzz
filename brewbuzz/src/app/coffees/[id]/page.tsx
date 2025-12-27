import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Coffee, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/review-form"; // Ensure this component exists
import { createClient } from "@/utils/supabase/server";

export default async function CoffeePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [coffeeResult, reviewsResult] = await Promise.all([
        supabase
            .from("coffees_with_stats")
            .select("*, roasters(name, country)")
            .eq("id", id)
            .single(),
        supabase
            .from("reviews")
            .select("*, profiles(email)")
            .eq("coffee_id", id)
            .order("created_at", { ascending: false }),
    ]);

    const coffee = coffeeResult.data;
    const reviews = reviewsResult.data || [];

    if (!coffee) notFound();

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            <main className="container py-10 md:py-16">
                {/* Breadcrumb */}
                <Link
                    href="/coffees"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-500 hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Reviews
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-start">

                    {/* LEFT COLUMN: Image - STRICT SQUARE & BORDER */}
                    <div className="relative aspect-square w-full bg-secondary border border-border overflow-hidden shrink-0 sticky top-24">
                        {/* Note: No 'rounded' classes here at all */}
                        {coffee.image_url ? (
                            <Image
                                src={coffee.image_url}
                                alt={coffee.name}
                                fill
                                className="object-cover" // Ensure image fills the square box
                                priority
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-secondary">
                                <Coffee className="h-20 w-20 text-border" />
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-ink-500 font-medium mb-3 text-sm uppercase tracking-wider">
                                <Link
                                    href={`/roasters/${coffee.roaster_id}`}
                                    className="hover:text-primary transition-colors font-bold"
                                >
                                    {coffee.roasters.name}
                                </Link>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {coffee.roasters.country || "Unknown Origin"}
                                </span>
                            </div>

                            <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-900 leading-tight mb-4">
                                {coffee.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4">
                                {coffee.average_rating > 0 && (
                                    <div className="flex items-center gap-1 bg-ink-900 text-white px-3 py-1 text-sm font-bold">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span>{coffee.average_rating.toFixed(1)}</span>
                                        <span className="text-ink-300 font-normal ml-1">
                                            ({coffee.review_count} reviews)
                                        </span>
                                    </div>
                                )}
                                {/* Badge: Added rounded-none explicitly */}
                                <Badge variant="outline" className="border-primary text-primary font-bold uppercase tracking-wider rounded-none">
                                    {coffee.roast_level} Roast
                                </Badge>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="prose prose-lg prose-ink max-w-none">
                            <h3 className="font-serif text-2xl font-bold mb-4 text-ink-900">About this Coffee</h3>
                            <p className="text-ink-700 leading-relaxed">
                                {coffee.description || "No description provided for this coffee yet."}
                            </p>
                        </div>

                        {coffee.top_flavors && coffee.top_flavors.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-serif text-lg font-bold text-ink-900">Flavor Profile</h4>
                                <div className="flex flex-wrap gap-2">
                                    {coffee.top_flavors.map((flavor: string) => (
                                        <span
                                            key={flavor}
                                            className="px-4 py-1.5 bg-secondary text-ink-700 text-sm font-medium border border-border italic"
                                        >
                                            #{flavor}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator className="bg-border my-8" />

                        {/* Reviews Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-3xl font-bold text-ink-900">
                                    Community Reviews
                                </h3>
                                {user && <ReviewForm coffeeId={coffee.id} userId={user.id} />}
                            </div>

                            {reviews.length === 0 ? (
                                <p className="text-ink-500 py-8 italic border-y border-border">
                                    No reviews yet. Be the first to try it!
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-border pb-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-ink-900">
                                                        {review.profiles?.email?.split("@")[0] || "Anonymous"}
                                                    </p>
                                                    <p className="text-xs text-ink-500 uppercase tracking-wider">Verified Buyer</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-ink-700 leading-relaxed">{review.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}