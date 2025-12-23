import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { ReviewModal } from "@/components/review-modal";

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
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
              <Image src={coffee.image_url} alt={coffee.name} fill className="object-cover" priority />
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span className="font-semibold text-primary">{coffee.roasters.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {coffee.roasters.country}</span>
              </div>
              <h1 className="font-serif text-4xl font-bold">{coffee.name}</h1>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline" className="text-base px-3 py-1">{coffee.roast_level} Roast</Badge>
              </div>
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
                          <span className="font-semibold text-sm">Verified User</span>
                          <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                       </div>
                       <p className="text-sm">{review.body}</p>
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