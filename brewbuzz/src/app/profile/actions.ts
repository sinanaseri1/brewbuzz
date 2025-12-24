"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string) {
    const supabase = await createClient();

    const { error, count } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

    if (error) {
        console.error("Delete Error:", error);
        throw new Error("Failed to delete review");
    }

    // Debug log to your terminal
    console.log(`Deleted review ${reviewId}. Rows affected: ${count}`);

    revalidatePath("/profile");
    revalidatePath("/coffees");
}