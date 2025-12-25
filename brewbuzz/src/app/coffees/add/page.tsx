import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCoffeeForm } from "@/app/admin/add-coffee-form"; // We can REUSE the form!

export default async function AddMissingCoffeePage() {
    const supabase = await createClient();

    // 1. Must be logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Fetch existing roasters (even hidden ones, so we don't create duplicates)
    const { data: roasters } = await supabase
        .from("roasters")
        .select("*")
        .order("name");

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <main className="container max-w-xl py-12">
                <div className="mb-6">
                    <h1 className="font-serif text-3xl font-bold text-slate-900">Add a Missing Coffee</h1>
                    <p className="text-slate-500 mt-2">
                        Can't find what you're drinking? Add it to the database.
                        It will be visible to you immediately, and to everyone else once approved.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Coffee Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* We reuse the Admin Form, but we need to tweak it slightly to handle "User Mode" */}
                        <AddCoffeeForm roasters={roasters || []} isUserSubmission={true} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}