import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { MapPin, ArrowRight } from "lucide-react";

export default async function RoastersIndex() {
    const supabase = await createClient();

    // Fetch all roasters alphabetically
    const { data: roasters } = await supabase
        .from("roasters")
        .select("*")
        .order("name");

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="container py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-serif text-5xl font-bold mb-6 text-ink-900">
                        Roaster Directory
                    </h1>
                    <p className="text-xl text-ink-500 mb-12 leading-relaxed border-b border-border pb-12">
                        The complete index of independent roasters tracked by the BrewBuzz community.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {roasters?.map((roaster) => (
                            <Link
                                key={roaster.id}
                                href={`/roasters/${roaster.id}`}
                                className="group flex items-start justify-between py-6 border-b border-border hover:bg-secondary/30 transition-colors px-2 -mx-2"
                            >
                                <div>
                                    <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors">
                                        {roaster.name}
                                    </h3>
                                    {roaster.country && (
                                        <div className="flex items-center gap-2 text-ink-500 mt-2 text-sm font-medium uppercase tracking-wider">
                                            <MapPin className="h-3 w-3" />
                                            {roaster.country}
                                        </div>
                                    )}
                                </div>
                                <ArrowRight className="h-5 w-5 text-border group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}