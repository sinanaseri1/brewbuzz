import { notFound } from "next/navigation";
import { MapPin, Coffee } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";
import { createClient } from "@/utils/supabase/server";

export default async function RoasterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Parallel Fetch: Get Roaster Info AND Their Coffees
    const [roasterResult, coffeesResult] = await Promise.all([
        supabase.from("roasters").select("*").eq("id", id).single(),
        supabase
            .from("coffees_with_stats") // Use the view to get ratings
            .select("*")
            .eq("roaster_id", id)
            .order("average_rating", { ascending: false }),
    ]);

    const roaster = roasterResult.data;
    const coffees = coffeesResult.data || [];

    if (!roaster) notFound();

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            {/* Roaster Header */}
            <div className="bg-white border-b">
                <div className="container py-12 md:py-16">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                        {/* Roaster Avatar / Icon Placeholder */}
                        <div className="h-24 w-24 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
                            <span className="font-serif text-4xl font-bold">
                                {roaster.name.charAt(0)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900">
                                {roaster.name}
                            </h1>
                            {roaster.country && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{roaster.country}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Roaster's Coffees */}
            <main className="container py-12">
                <div className="flex items-center gap-2 mb-8">
                    <Coffee className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-2xl font-bold">Their Coffees</h2>
                    <span className="ml-2 text-sm text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                        {coffees.length}
                    </span>
                </div>

                {coffees.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {coffees.map((coffee) => (
                            <CoffeeCard
                                key={coffee.id}
                                id={coffee.id}
                                name={coffee.name}
                                roaster={coffee.roaster_name}
                                // We pass roasterId so the card knows not to link to the page we are already on (optional polish)
                                imageUrl={coffee.image_url}
                                rating={coffee.average_rating}
                                roastLevel={coffee.roast_level}
                                flavors={coffee.top_flavors || []}
                                reviewCount={coffee.review_count}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">
                            No coffees listed for this roaster yet.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}