import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Coffees + Linked Roaster Name
  const { data: coffees } = await supabase
    .from("coffees")
    .select(`
      *,
      roasters (
        name
      )
    `);

  // 2. Format the data for the UI
  // Note: We don't have reviews yet, so we default rating/flavors to empty/0
  const formattedCoffees = coffees?.map((coffee: any) => ({
    id: coffee.id,
    name: coffee.name,
    roaster: coffee.roasters.name, // Extracted from the join
    imageUrl: coffee.image_url,
    rating: 0, // Placeholder until we add reviews
    roastLevel: coffee.roast_level,
    flavors: [], // Placeholder until we add reviews
    reviewCount: 0,
  })) || [];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
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

      {/* Grid Section */}
      <section className="container pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {formattedCoffees.map((coffee) => (
            <CoffeeCard key={coffee.id} {...coffee} />
          ))}
        </div>
      </section>
    </main>
  );
}