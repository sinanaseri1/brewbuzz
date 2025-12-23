import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { ReviewModal } from "@/components/review-modal";

export default async function CoffeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Coffee Details & Reviews in parallel
  const [coffeeResult, reviewsResult] = await Promise.all([
    supabase.from("coffees").select("*, roasters(*)").eq("id", id).single(),
    supabase
      .from("reviews")
      .select("*")
      .eq("coffee_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const { data: coffee, error } = coffeeResult;
  const reviews = reviewsResult.data || [];

  if (error || !coffee) {
    notFound();
  }

  // 2. Calculate Statistics on the fly
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Image */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
              <Image
                src={coffee.image_url}
                alt={coffee.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* RIGHT: Details & Reviews */}
          <div className="space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span className="font-semibold text-primary">
                  {coffee.roasters.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {coffee.roasters.country}
                </span>
              </div>

              <h1 className="font-serif text-4xl font-bold">{coffee.name}</h1>

              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  {coffee.roast_level} Roast
                </Badge>
                {coffee.process && (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {coffee.process}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 py-6 border-y">
              <div className="text-center px-4">
                <div className="text-4xl font-bold font-serif">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex text-yellow-400 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? "fill-current"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {reviews.length} reviews
                </div>
              </div>
              <div className="flex-1 border-l pl-6">
                <p className="text-muted-foreground text-sm">
                   A {coffee.roast_level} roast by {coffee.roasters.name}.
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold">Reviews</h3>
                <ReviewModal coffeeId={id} />
              </div>

              {reviews.length === 0 ? (
                <div className="py-12 text-center border border-dashed rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to taste this!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 p-4 border rounded-lg bg-card shadow-sm"
                    >
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">
                            Verified User
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Star Display */}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Flavors */}
                        {review.flavor_tags && review.flavor_tags.length > 0 && (
                           <div className="flex flex-wrap gap-1">
                              {review.flavor_tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1 h-5">
                                   {tag}
                                </Badge>
                              ))}
                           </div>
                        )}

                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {review.body}
                        </p>
                      </div>
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