import Link from "next/link";
import Image from "next/image";
import { Star, Coffee } from "lucide-react";

interface CoffeeCardProps {
  id: string;
  name: string;
  roaster: string;
  imageUrl: string | null;
  rating: number;
  roastLevel: string;
  flavors?: string[];
  reviewCount?: number;
}

export function CoffeeCard({
  id,
  name,
  roaster,
  imageUrl,
  rating,
  roastLevel,
  flavors = [],
  reviewCount = 0,
}: CoffeeCardProps) {
  return (
    <Link href={`/coffees/${id}`} className="group block h-full">
      {/* Container: No shadow, border with warm color, off-white background */}
      <div className="h-full flex flex-col border border-stone-200 bg-white rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">

        {/* IMAGE: Add a slight sepia filter on hover for vintage feel */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 flex items-center justify-center border-b border-stone-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:sepia-[.2]"
            />
          ) : (
            <Coffee className="h-10 w-10 text-stone-300" />
          )}

          {/* Floating Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-stone-100 flex items-center gap-1 text-stone-900">
            {rating > 0 ? rating.toFixed(1) : "-"} <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Metadata Row - Use Monospace font if available, or just uppercase tracking */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
              {roastLevel} Roast
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-stone-500 mb-4 font-medium">
            {roaster}
          </p>

          {/* Flavors as distinct tags */}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {flavors && flavors.slice(0, 3).map((flavor) => (
              <span
                key={flavor}
                className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-medium"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}