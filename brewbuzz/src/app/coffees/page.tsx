import Link from "next/link";
import { SearchX } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";
import { CoffeeSearch } from "@/components/coffee-search";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function CoffeesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; roast?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const roast = params.roast || "";

  const supabase = await createClient();
  let dbQuery = supabase.from("coffees_with_stats").select("*");

  if (query) dbQuery = dbQuery.or(`name.ilike.%${query}%,roaster_name.ilike.%${query}%`);
  if (roast && roast !== "all") dbQuery = dbQuery.eq("roast_level", roast);

  const { data: coffees } = await dbQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-serif text-3xl font-bold mb-8">Browse Coffees</h1>
        <CoffeeSearch />

        {coffees && coffees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coffees.map((coffee) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed bg-muted/30">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <SearchX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No coffees found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              We couldn't find matches for "{query}".
              Be the first to add this coffee to our database.
            </p>
            <Button asChild>
              <Link href="/coffees/add">Add Missing Coffee</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}