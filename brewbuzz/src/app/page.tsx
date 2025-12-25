import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Activity, Search, Coffee } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch Data
  const [trendingResult, recentReviewsResult, statsResult] = await Promise.all([
    supabase.from("coffees_with_stats").select("*").gt("review_count", 0).order("average_rating", { ascending: false }).limit(4),
    supabase.from("reviews").select("*, coffees(name, image_url, roasters(name)), profiles:user_id(email)").order("created_at", { ascending: false }).limit(3),
    supabase.from("coffees").select("id", { count: "exact", head: true }),
  ]);

  const trendingCoffees = trendingResult.data || [];
  const recentReviews = recentReviewsResult.data || [];
  const coffeeCount = statsResult.count || 0;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* 1. HERO SECTION */}
      {/* Reduced padding on mobile (py-16) vs desktop (lg:py-32) */}
      <section className="relative bg-white border-b py-16 lg:py-32 overflow-hidden px-4 sm:px-6">
        <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">

          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
            Now tracking {coffeeCount} coffees
          </Badge>

          {/* Responsive Text Size: 4xl on mobile -> 7xl on desktop */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Find your next <br />
            <span className="text-primary">perfect brew.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
            The community-driven database for coffee lovers. Discover new roasters and track your tastings.
          </p>

          {/* Search Form - Stacks on very small screens if needed, but usually row is fine */}
          <form action="/coffees" className="flex w-full max-w-md mx-auto items-center gap-2 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search beans..."
                className="pl-9 h-12 text-base shadow-sm"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">Search</Button>
          </form>

          {/* Categories - Hide some on mobile if it gets too crowded */}
          <div className="pt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span className="hidden xs:inline">Try:</span>
            <Link href="/coffees?roast=Light" className="hover:text-primary underline decoration-dotted">Light Roast</Link>
            <span>•</span>
            <Link href="/coffees?q=Ethiopia" className="hover:text-primary underline decoration-dotted">Ethiopia</Link>
          </div>
        </div>

        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0 pointer-events-none" />
      </section>

      {/* 2. TRENDING SECTION */}
      <section className="py-12 sm:py-20 container px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" /> Trending
            </h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Top-rated beans this week.</p>
          </div>
          <Button variant="ghost" asChild className="self-end sm:self-auto -mt-2 sm:mt-0">
            <Link href="/coffees">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Grid is 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCoffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              id={coffee.id}
              name={coffee.name}
              roaster={coffee.roaster_name}
              imageUrl={coffee.image_url}
              rating={coffee.average_rating}
              roastLevel={coffee.roast_level}
              flavors={coffee.top_flavors || []}
              reviewCount={coffee.review_count}
            />
          ))}
        </div>
      </section>

      {/* 3. COMMUNITY PULSE */}
      <section className="py-12 sm:py-20 bg-white border-y px-4 sm:px-8">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Activity className="h-6 w-6 text-primary" /> Community Pulse
            </h2>
            <p className="text-muted-foreground">See what others are drinking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {recentReviews.map((review) => (
              <div key={review.id} className="group relative bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.profiles?.email?.[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{review.profiles?.email?.split('@')[0]}</p>
                    <p className="text-slate-500 text-xs">Verified User</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed line-clamp-3 text-sm sm:text-base">"{review.body}"</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-10 w-10 rounded bg-white border flex items-center justify-center overflow-hidden shrink-0">
                    {review.coffees?.image_url ? (
                      <img src={review.coffees.image_url} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <Coffee className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="overflow-hidden min-w-0"> {/* min-w-0 fixes flex text truncation */}
                    <p className="font-bold text-sm truncate">{review.coffees?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{review.coffees?.roasters?.name}</p>
                  </div>
                  <Link href={`/coffees/${review.coffee_id}`} className="ml-auto inset-0 absolute">
                    <span className="sr-only">View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 sm:py-12 text-center text-sm text-slate-500 px-4">
        <p>© {new Date().getFullYear()} BrewBuzz. Built for the love of coffee.</p>
      </footer>
    </div>
  );
}