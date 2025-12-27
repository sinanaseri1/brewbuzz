"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pencil } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // If you have sonner installed, otherwise remove

interface ReviewFormProps {
    coffeeId: string;
    userId: string;
}

export function ReviewForm({ coffeeId, userId }: ReviewFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a star rating."); // Simple fallback if no toast
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.from("reviews").insert({
            coffee_id: coffeeId,
            user_id: userId,
            rating,
            body,
        });

        setIsSubmitting(false);

        if (error) {
            console.error(error);
            alert("Failed to submit review. Please try again.");
        } else {
            setIsOpen(false);
            setRating(0);
            setBody("");
            router.refresh(); // Refresh page to show new review
            // toast.success("Review submitted!"); 
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white rounded-none font-bold uppercase tracking-wider">
                    <Pencil className="h-4 w-4" />
                    Write a Review
                </Button>
            </DialogTrigger>

            {/* Square Dialog Content */}
            <DialogContent className="sm:max-w-[425px] rounded-none border-border">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-ink-900">Rate this Coffee</DialogTitle>
                    <DialogDescription>
                        Share your tasting notes with the community.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* Star Rating Input */}
                    <div className="space-y-2">
                        <Label className="font-bold uppercase tracking-wider text-xs text-ink-500">
                            Rating
                        </Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    type="button"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating
                                                ? "fill-primary text-primary" // Filled Red
                                                : "text-gray-300" // Empty Grey
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Body Input */}
                    <div className="space-y-2">
                        <Label htmlFor="review-body" className="font-bold uppercase tracking-wider text-xs text-ink-500">
                            Your Review
                        </Label>
                        <Textarea
                            id="review-body"
                            placeholder="What notes did you taste? (e.g. fruity, chocolatey, acidic...)"
                            className="rounded-none border-border focus-visible:ring-ink-900 min-h-[100px]"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="rounded-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-ink-900 text-white hover:bg-ink-700 rounded-none font-bold"
                    >
                        {isSubmitting ? "Posting..." : "Post Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}