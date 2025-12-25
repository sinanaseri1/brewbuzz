import Link from "next/link";
import { Coffee, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./user-nav";
import { signOutAction } from "@/app/auth/actions"; // <--- Import is SAFE here

export async function Navbar() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        isAdmin = profile?.role === "admin";
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between">

                <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Coffee className="h-5 w-5" />
                    </div>
                    BrewBuzz
                </Link>

                <div className="flex items-center gap-4">

                    {isAdmin && (
                        <Button variant="ghost" size="sm" asChild className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </Button>
                    )}

                    {user ? (
                        <>
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/coffees/add">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Coffee
                                </Link>
                            </Button>

                            {/* Pass the action down as a prop */}
                            <UserNav email={user.email!} />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}