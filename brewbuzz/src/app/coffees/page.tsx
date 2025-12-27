import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function CoffeesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const supabase = await createClient();

  // DEBUGGING: Log that we are trying to fetch
  console.log("--- FETCHING COFFEES ---");

  // 1. Try to fetch WITHOUT the 'is_public' filter first to see if that's the blocker
  let dbQuery = supabase
    .from("coffees_with_stats")
    .select("*");

  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data: coffees, error } = await dbQuery;

  // DEBUGGING: Log the result
  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("COFFEES FOUND:", coffees?.length);
    if (coffees?.length === 0) {
      // If view is empty, check raw table to see if data exists at all
      const { count } = await supabase.from("coffees").select("*", { count: 'exact', head: true });
      console.log("RAW TABLE ROW COUNT:", count);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <main className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="font-serif text-5xl font-bold text-ink-900 mb-2">
              Reviews & Ratings
            </h1>
            <p className="text-ink-500 font-medium uppercase tracking-wider text-sm">
              Archive: {coffees?.length || 0} Coffees
            </p>
          </div>

          <form className="flex w-full md:w-auto max-w-sm gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-ink-500" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search database..."
                className="pl-9 rounded-none border-ink-300 focus-visible:ring-ink-900"
              />
            </div>
            <Button type="submit" className="rounded-none bg-ink-900 text-white font-bold uppercase tracking-wider">
              Filter
            </Button>
          </form>
        </div>

        <Separator className="bg-ink-900 mb-12 h-0.5" />

        {/* ERROR DISPLAY: If there is an error, show it on screen */}
        {error && (
          <div className="bg-red-50 p-4 border border-red-200 text-red-800 mb-8 font-mono text-sm">
            Error: {error.message}
          </div>
        )}

        {!coffees || coffees.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-ink-300">
            <h3 className="font-serif text-2xl text-ink-900 mb-2">No results found</h3>
            <p className="text-ink-500">
              {query ? `No match for "${query}"` : "Database appears empty."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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
        )}
      </main>
    </div>
  );
}