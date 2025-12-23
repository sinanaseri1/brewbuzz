import { Navbar } from "@/components/navbar";
import { CoffeeCard } from "@/components/coffee-card";

export default function Home() {
  // Temporary dummy data
  const featuredCoffees = [
    {
      id: "1",
      name: "Holler Mountain",
      roaster: "Stumptown",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
      rating: 4.5,
      roastLevel: "Medium",
      flavors: ["Caramel", "Fruit", "Creamy"],
      reviewCount: 128,
    },
    {
      id: "2",
      name: "Hair Bender",
      roaster: "Stumptown",
      imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop",
      rating: 4.8,
      roastLevel: "Dark",
      flavors: ["Dark Chocolate", "Citrus", "Toffee"],
      reviewCount: 342,
    },
    {
      id: "3",
      name: "Three Africas",
      roaster: "Blue Bottle",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
      rating: 4.2,
      roastLevel: "Light",
      flavors: ["Golden Raisin", "Winey", "Lemon"],
      reviewCount: 89,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container py-12 md:py-24 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">
            Discover your next favorite brew.
          </h1>
          <p className="text-muted-foreground text-lg">
            Join the community of coffee lovers. Rate, review, and track the best beans from around the world.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCoffees.map((coffee) => (
            <CoffeeCard key={coffee.id} {...coffee} />
          ))}
        </div>
      </section>
    </main>
  );
}