"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/app/coffees/[id]/actions";

export function ReviewModal({ coffeeId }: { coffeeId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  async function clientAction(formData: FormData) {
    // Append the star rating to the form data manually
    formData.append("rating", rating.toString());
    formData.append("coffeeId", coffeeId);
    
    await submitReview(formData);
    setOpen(false); // Close modal on success
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate this Coffee</DialogTitle>
          <DialogDescription>
            Share your experience with the community.
          </DialogDescription>
        </DialogHeader>
        
        <form action={clientAction} className="grid gap-4 py-4">
          {/* Hidden Input for ID is handled in clientAction via append */}
          
          {/* Star Rating Input */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <input type="hidden" name="rating" value={rating} />

          <div className="grid gap-2">
            <Label htmlFor="flavors">Flavor Notes</Label>
            <Input
              id="flavors"
              name="flavors"
              placeholder="e.g. Blueberry, Chocolate, Earthy"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="body">Review</Label>
            <Textarea
              id="body"
              name="body"
              placeholder="What did you think of the brew method and taste?"
            />
          </div>

          <Button type="submit">Post Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}