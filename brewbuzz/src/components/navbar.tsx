import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Logo } from "@/components/logo";
import { UserNav } from "./user-nav";

// --- CONFIGURATION ---
const NAV_LINKS = [
    { label: "News", href: "#", disabled: true },
    { label: "Reviews", href: "/coffees", disabled: false },
    { label: "Roasters", href: "/roasters", disabled: false },
    { label: "Equipment", href: "#", disabled: true },
    { label: "Culture", href: "#", disabled: true },
];

const TRENDING_TOPICS = [
    { label: "Best Espresso Machines 2025", href: "#" },
    { label: "The Rise of Robusta", href: "#" },
    { label: "Ethiopian Harvest Guide", href: "#" },
];

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="flex flex-col w-full border-b border-ink-100 bg-white sticky top-0 z-50">

            {/* 1. MAIN MASTHEAD */}
            <div className="container h-20 flex items-center justify-between px-4 sm:px-8">

                {/* Left: Brand & Mobile Trigger */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Icon (Visible only on mobile) */}
                    <Button variant="ghost" size="icon" className="md:hidden text-ink-900 -ml-2">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menu</span>
                    </Button>

                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 text-primary transition-colors group-hover:text-primary/80">
                            <Logo className="w-full h-full" />
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-ink-900 hidden sm:inline-block">
                            BrewBuzz
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((item) => (
                        item.disabled ? (
                            // Disabled State
                            <span
                                key={item.label}
                                className="text-sm font-bold uppercase tracking-wider text-ink-500 cursor-not-allowed opacity-50 select-none"
                                title="Coming Soon"
                            >
                                {item.label}
                            </span>
                        ) : (
                            // Active State
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-bold uppercase tracking-wider text-ink-900 hover:text-primary border-b-2 border-transparent hover:border-primary transition-all py-1"
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" className="text-ink-900">
                        <Search className="h-5 w-5" />
                    </Button>

                    <div className="h-6 w-px bg-ink-100 mx-1 hidden sm:block" />

                    {user ? (
                        <UserNav email={user.email!} />
                    ) : (
                        <Button variant="default" size="sm" asChild className="bg-ink-900 text-white hover:bg-ink-700 font-bold px-6">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* 2. SUB-HEADER (Trending) */}
            <div className="hidden md:block border-t border-ink-100 bg-secondary/30">
                <div className="container h-10 flex items-center gap-6 text-xs font-medium text-ink-500">
                    <span className="text-primary font-bold uppercase">Trending:</span>
                    {TRENDING_TOPICS.map((topic, index) => (
                        <Link
                            key={index}
                            href={topic.href}
                            className="hover:text-ink-900 transition-colors"
                        >
                            {topic.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}