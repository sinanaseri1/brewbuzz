import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Coffee, Star, Calendar } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Get Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User's Reviews (with Coffee details)
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, coffees(name, image_url, roasters(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-10 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT: User Card */}
          <Card className="w-full md:w-[300px] shrink-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 text-4xl font-serif font-bold text-muted-foreground">
                {user.email?.[0].toUpperCase()}
              </div>
              <CardTitle>{user.email}</CardTitle>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Settings (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT: Activity Feed */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold">My Reviews</h2>
              <p className="text-muted-foreground">
                You have rated {reviews?.length || 0} coffees.
              </p>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="grid gap-4">
                {reviews.map((review: any) => (
                  <Link 
                    key={review.id} 
                    href={`/coffees/${review.coffee_id}`}
                    className="block group"
                  >
                    <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                      <div className="flex gap-4 p-4">
                        {/* Coffee Image Thumbnail */}
                        <div 
                          className="h-16 w-16 rounded bg-muted bg-cover bg-center shrink-0 border"
                          style={{ backgroundImage: `url(${review.coffees.image_url})` }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold truncate pr-4 group-hover:text-primary transition-colors">
                                {review.coffees.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {review.coffees.roasters.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full text-xs font-bold">
                              {review.rating} <Star className="h-3 w-3 fill-current" />
                            </div>
                          </div>
                          
                          <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                            "{review.body}"
                          </p>
                          
                          {/* Flavor Tags */}
                          {review.flavor_tags && review.flavor_tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.flavor_tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Coffee className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tasting and tracking your favorite beans.
                </p>
                <Button asChild>
                  <Link href="/coffees">Browse Coffees</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}