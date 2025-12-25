import Link from "next/link";
import Image from "next/image";
import { Star, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Link href={`/coffees/${id}`} className="block group h-full">
      <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md h-full flex flex-col">
        {/* IMAGE SECTION: Now handles missing images safely */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground/30">
              <Coffee className="h-12 w-12" />
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-bold truncate pr-2 group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {roaster}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              {rating > 0 ? rating.toFixed(1) : "-"} <Star className="h-3 w-3 fill-current" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-normal">
              {roastLevel}
            </Badge>
            {reviewCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            )}
          </div>

          {/* Optional: Show flavor tags if available */}
          {flavors && flavors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {flavors.slice(0, 2).map((flavor) => (
                <span key={flavor} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {flavor}
                </span>
              ))}
              {flavors.length > 2 && (
                <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                  +{flavors.length - 2}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}