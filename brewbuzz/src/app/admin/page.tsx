import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, User } from "lucide-react";
import { AddCoffeeForm } from "./add-coffee-form";
import { approveSubmission, rejectSubmission } from "./submission-actions";

export default async function AdminPage() {
    const supabase = await createClient();

    // 1. Auth & Admin Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") redirect("/");

    // 2. Fetch Data
    // A. Roasters for the dropdown
    const { data: roasters } = await supabase.from("roasters").select("*").order("name");

    // B. Pending Submissions (Coffees where is_public is FALSE)
    const { data: pendingCoffees } = await supabase
        .from("coffees")
        .select("*, roasters(name), profiles:submitted_by(email)") // Join to see who submitted it
        .eq("is_public", false)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="container max-w-4xl py-12 space-y-8">

                {/* HEADER */}
                <div>
                    <h1 className="font-serif text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview of database activity.</p>
                </div>

                {/* SECTION 1: PENDING QUEUE */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Review Queue
                        {pendingCoffees && pendingCoffees.length > 0 && (
                            <Badge variant="destructive">{pendingCoffees.length}</Badge>
                        )}
                    </h2>

                    {pendingCoffees && pendingCoffees.length > 0 ? (
                        <div className="grid gap-4">
                            {pendingCoffees.map((coffee: any) => (
                                <Card key={coffee.id} className="overflow-hidden border-l-4 border-l-yellow-400">
                                    <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

                                        {/* Coffee Details */}
                                        <div className="flex gap-4 items-center">
                                            {/* Thumbnail */}
                                            <div
                                                className="h-16 w-16 rounded bg-muted bg-cover bg-center border shrink-0"
                                                style={{ backgroundImage: `url(${coffee.image_url})` }}
                                            />

                                            <div>
                                                <h3 className="font-bold text-lg">{coffee.name}</h3>
                                                <div className="flex flex-col text-sm text-muted-foreground">
                                                    <span>Roaster: {coffee.roasters?.name || "Unknown"}</span>
                                                    <span className="flex items-center gap-1 mt-1 text-xs">
                                                        <User className="h-3 w-3" />
                                                        Submitted by: {coffee.profiles?.email || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <form action={async () => {
                                                "use server";
                                                await rejectSubmission(coffee.id);
                                            }}>
                                                <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 border-red-200">
                                                    <X className="mr-2 h-4 w-4" /> Reject
                                                </Button>
                                            </form>

                                            <form action={async () => {
                                                "use server";
                                                await approveSubmission(coffee.id);
                                            }}>
                                                <Button size="sm" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                                                    <Check className="mr-2 h-4 w-4" /> Approve
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-slate-50 border-dashed">
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <Check className="mx-auto h-8 w-8 mb-2 text-green-500/50" />
                                <p>All caught up! No pending submissions.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* SECTION 2: ADD COFFEE FORM */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">Quick Add</h2>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-white border-b border-slate-100 pb-6">
                            <CardTitle className="font-serif text-xl">Add New Coffee</CardTitle>
                            <CardDescription>
                                Directly add items to the database (bypasses review queue).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <AddCoffeeForm roasters={roasters || []} />
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    );
}