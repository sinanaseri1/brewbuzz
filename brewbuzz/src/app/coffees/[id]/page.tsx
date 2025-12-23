import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";

export default async function CoffeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Coffee Details & Reviews in parallel
  const [coffeeResult, reviewsResult] = await Promise.all([
    supabase
      .from("coffees")
      .select("*, roasters(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("reviews")
      .select("*, profiles:user_id(username, avatar_url)") // Assuming we will have profiles later
      .eq("coffee_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const { data: coffee, error } = coffeeResult;
  
  if (error || !coffee) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: Image & Key Stats */}
          <div className="space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
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
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <span className="font-semibold text-primary">{coffee.roasters.name}</span>
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

            <div className="flex items-center gap-4 py-6 border-y">
              <div className="text-center px-4">
                <div className="text-3xl font-bold font-serif">0.0</div>
                <div className="flex text-yellow-400 justify-center">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 text-muted" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">0 reviews</div>
              </div>
              <div className="flex-1 border-l pl-6">
                <p className="text-muted-foreground text-sm">
                  No flavor profile available yet. Be the first to review this coffee!
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-serif text-2xl font-bold">Reviews</h3>
                 <Button>Write a Review</Button>
              </div>
              
              {/* Empty State */}
              <div className="py-12 text-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No reviews yet.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}