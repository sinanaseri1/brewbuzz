import Link from "next/link";
import Image from "next/image";
import { Star, Coffee, ArrowUpRight } from "lucide-react";

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
}: CoffeeCardProps) {
  return (
    <Link href={`/coffees/${id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white border border-border transition-all duration-200 hover:border-ink-900">

        {/* IMAGE: Square, Sharp, No Radius */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary border-b border-border">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Coffee className="h-8 w-8 opacity-20" />
            </div>
          )}

          {/* Rating Tag: Sharp rectangle in the corner */}
          {rating > 0 && (
            <div className="absolute top-0 right-0 bg-ink-900 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
              {rating.toFixed(1)} <Star className="h-3 w-3 fill-white text-white" />
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 gap-3">
          {/* Metadata: Uppercase & Technical */}
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {roastLevel}
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold leading-tight group-hover:underline decoration-2 decoration-primary underline-offset-4">
              {name}
            </h3>
            <p className="text-sm text-ink-500 mt-1 font-medium">
              by {roaster}
            </p>
          </div>

          {/* Flavors: Text links instead of bubbles */}
          {flavors.length > 0 && (
            <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-x-4 gap-y-1">
              {flavors.slice(0, 3).map((flavor) => (
                <span key={flavor} className="text-xs font-medium text-ink-500 italic">
                  #{flavor}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}