import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-serif text-xl font-bold">BrewBuzz</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/roasters" className="transition-colors hover:text-foreground/80">Roasters</Link>
          <Link href="/coffees" className="transition-colors hover:text-foreground/80">Coffees</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
             <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}