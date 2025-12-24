import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function RoastersPage() {
  const supabase = await createClient();
  const { data: roasters } = await supabase.from("roasters").select("*");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-10">
        <div className="mb-8 space-y-2">
          <h1 className="font-serif text-3xl font-bold">Our Roasters</h1>
          <p className="text-muted-foreground">
            The talented teams behind the beans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roasters?.map((roaster) => (
            <Card key={roaster.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif text-xl">
                      {roaster.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {roaster.country}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Known for quality sourcing and unique roast profiles.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto gap-2 pt-0">
                {/* 1. View their Coffees (Links to your Catalog with a search filter) */}
                <Button asChild className="flex-1">
                  <Link href={`/coffees?q=${roaster.name}`}>View Coffees</Link>
                </Button>
                
                {/* 2. Visit Website (External) */}
                {roaster.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={roaster.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}