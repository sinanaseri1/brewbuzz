import Link from "next/link";
import { Coffee, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./user-nav";

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
            <div className="container flex h-16 items-center justify-between px-4 sm:px-8">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                        <Coffee className="h-5 w-5" />
                    </div>
                    {/* Hide the text "BrewBuzz" on VERY small phones if needed, but usually it fits */}
                    <span className="hidden xs:inline">BrewBuzz</span>
                </Link>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* A. ADMIN LINK */}
                    {isAdmin && (
                        <Button variant="ghost" size="sm" asChild className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-4">
                            <Link href="/admin">
                                <Shield className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        </Button>
                    )}

                    {user ? (
                        <>
                            {/* B. ADD COFFEE LINK (Icon only on mobile, Text on Desktop) */}
                            <Button size="sm" variant="outline" asChild className="px-2 sm:px-4">
                                <Link href="/coffees/add">
                                    <Plus className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Add Coffee</span>
                                </Link>
                            </Button>

                            {/* Profile Dropdown */}
                            <UserNav email={user.email!} />
                        </>
                    ) : (
                        /* C. GUEST VIEW */
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