import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Star, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
    const supabase = await createClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Get User's Reviews
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*, coffees(name, image_url, roasters(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // 3. Get User's Submissions (Coffees they added)
    const { data: submissions } = await supabase
        .from("coffees")
        .select("*, roasters(name)")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="container max-w-4xl py-12 space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-slate-500">{user.email}</p>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="reviews">My Reviews ({reviews?.length || 0})</TabsTrigger>
                        <TabsTrigger value="submissions">My Submissions ({submissions?.length || 0})</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: REVIEWS */}
                    <TabsContent value="reviews" className="mt-6 space-y-4">
                        {reviews?.length === 0 ? (
                            <EmptyState message="You haven't written any reviews yet." />
                        ) : (
                            reviews?.map((review) => (
                                <Card key={review.id} className="overflow-hidden">
                                    <div className="flex gap-4 p-4 sm:p-6">
                                        {/* Coffee Image */}
                                        <div className="h-16 w-16 shrink-0 relative rounded bg-muted overflow-hidden">
                                            {review.coffees?.image_url ? (
                                                <Image
                                                    src={review.coffees.image_url}
                                                    alt="coffee"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <Coffee className="h-6 w-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Review Content */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{review.coffees?.name}</h3>
                                                <span className="text-muted-foreground text-sm">by {review.coffees?.roasters?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                                                {review.rating} <Star className="h-3 w-3 fill-current" />
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-2">{review.body}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* TAB 2: SUBMISSIONS */}
                    <TabsContent value="submissions" className="mt-6 space-y-4">
                        {submissions?.length === 0 ? (
                            <EmptyState message="You haven't submitted any coffees yet." />
                        ) : (
                            submissions?.map((coffee) => (
                                <Card key={coffee.id} className="p-4 sm:p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                                            <Coffee className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{coffee.name}</h3>
                                            <p className="text-sm text-muted-foreground">{coffee.roasters?.name}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div>
                                        {coffee.is_public ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                                <CheckCircle className="h-3 w-3" /> Live
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
                                                <Clock className="h-3 w-3" /> Pending
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed bg-slate-50/50">
            <Coffee className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500">{message}</p>
        </div>
    );
}