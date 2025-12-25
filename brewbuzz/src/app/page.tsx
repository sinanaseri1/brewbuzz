import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Activity, Search, Coffee } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // PARALLEL DATA FETCHING
  const [trendingResult, recentReviewsResult, statsResult] = await Promise.all([
    // 1. Trending: Top 4 rated coffees with at least 1 review
    supabase
      .from("coffees_with_stats")
      .select("*")
      .gt("review_count", 0) // Only reviewed coffees
      .order("average_rating", { ascending: false })
      .limit(4),

    // 2. Recent Activity: Last 3 reviews with related coffee info
    supabase
      .from("reviews")
      .select("*, coffees(name, image_url, roasters(name)), profiles:user_id(email)")
      .order("created_at", { ascending: false })
      .limit(3),

    // 3. Simple count of coffees for social proof
    supabase.from("coffees").select("id", { count: "exact", head: true }),
  ]);

  const trendingCoffees = trendingResult.data || [];
  const recentReviews = recentReviewsResult.data || [];
  const coffeeCount = statsResult.count || 0;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative bg-white border-b py-20 lg:py-32 overflow-hidden">
        <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
            Now tracking {coffeeCount} coffees worldwide
          </Badge>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Find your next <br />
            <span className="text-primary">perfect brew.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The community-driven database for coffee lovers. Discover new roasters, track your tastings, and find the best beans near you.
          </p>

          {/* Search Form */}
          <form action="/coffees" className="flex w-full max-w-md mx-auto items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search roaster, bean, or flavor..."
                className="pl-9 h-12 text-base shadow-sm"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
          </form>

          {/* Quick Categories */}
          <div className="pt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Try:</span>
            <Link href="/coffees?roast=Light" className="hover:text-primary underline decoration-dotted">Light Roast</Link>
            <span>•</span>
            <Link href="/coffees?q=Ethiopia" className="hover:text-primary underline decoration-dotted">Ethiopia</Link>
            <span>•</span>
            <Link href="/coffees?q=Espresso" className="hover:text-primary underline decoration-dotted">Espresso</Link>
          </div>
        </div>

        {/* Background Pattern (Subtle grid) */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0 pointer-events-none" />
      </section>

      {/* 2. TRENDING SECTION */}
      <section className="py-20 container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" /> Trending this Week
            </h2>
            <p className="text-muted-foreground mt-1">The highest-rated beans as voted by the community.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/coffees">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

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

      {/* 3. COMMUNITY PULSE (RECENT REVIEWS) */}
      <section className="py-20 bg-white border-y">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Activity className="h-6 w-6 text-primary" /> Community Pulse
            </h2>
            <p className="text-muted-foreground text-lg">See what others are drinking right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReviews.map((review) => (
              <div key={review.id} className="group relative bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-slate-100">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.profiles?.email?.[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{review.profiles?.email?.split('@')[0]}</p>
                    <p className="text-slate-500 text-xs">Reviewed a moment ago</p>
                  </div>
                </div>

                {/* The Review */}
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed line-clamp-3">"{review.body}"</p>
                </div>

                {/* The Coffee Link */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-10 w-10 rounded bg-white border flex items-center justify-center overflow-hidden shrink-0">
                    {review.coffees?.image_url ? (
                      <img src={review.coffees.image_url} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <Coffee className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{review.coffees?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{review.coffees?.roasters?.name}</p>
                  </div>
                  <Link href={`/coffees/${review.coffee_id}`} className="ml-auto inset-0 absolute">
                    <span className="sr-only">View Coffee</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/coffees">Browse All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER (Simple) */}
      <footer className="py-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} BrewBuzz. Built for the love of coffee.</p>
      </footer>
    </div>
  );
}