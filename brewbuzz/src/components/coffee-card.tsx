import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface CoffeeCardProps {
  id: string;
  name: string;
  roaster: string;
  imageUrl: string;
  rating: number; // 1 to 5
  roastLevel: string; // e.g. "Light", "Medium"
  flavors: string[];
  reviewCount: number;
}

export function CoffeeCard({
  id,
  name,
  roaster,
  imageUrl,
  rating,
  roastLevel,
  flavors,
  reviewCount,
}: CoffeeCardProps) {
  return (
    <Link href={`/coffees/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Floating Rating Badge */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-sm font-semibold shadow-sm backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {roaster}
            </p>
            <span className="text-xs text-muted-foreground">{roastLevel} Roast</span>
          </div>
          <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-1.5 mt-2">
            {flavors.slice(0, 3).map((flavor) => (
              <Badge key={flavor} variant="secondary" className="font-normal text-xs">
                {flavor}
              </Badge>
            ))}
            {flavors.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{flavors.length - 3}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <p className="text-xs text-muted-foreground">
            Based on {reviewCount} reviews
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}