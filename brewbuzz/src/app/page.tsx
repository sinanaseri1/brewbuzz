import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Query the View directly. Fast and simple.
  const { data: coffees } = await supabase
    .from("coffees_with_stats")
    .select("*");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="container py-12 md:py-24 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">
            Discover your next favorite brew.
          </h1>
          <p className="text-muted-foreground text-lg">
            Join the community of coffee lovers. Rate, review, and track the best beans from around the world.
          </p>
        </div>
      </section>

      <section className="container pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coffees?.map((coffee) => (
            <CoffeeCard 
              key={coffee.id} 
              id={coffee.id}
              name={coffee.name}
              roaster={coffee.roaster_name}
              imageUrl={coffee.image_url}
              rating={coffee.average_rating}
              roastLevel={coffee.roast_level}
              flavors={coffee.top_flavors || []} // Handle nulls if no reviews
              reviewCount={coffee.review_count}
            />
          ))}
        </div>
      </section>
    </main>
  );
}