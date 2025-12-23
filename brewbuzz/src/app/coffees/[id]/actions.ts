"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to review.");
  }

  // 2. Extract Data
  const coffeeId = formData.get("coffeeId") as string;
  const rating = Number(formData.get("rating"));
  const body = formData.get("body") as string;
  
  // Parse tags: "Fruity, Nutty" -> ["Fruity", "Nutty"]
  const flavorInput = formData.get("flavors") as string;
  const flavorTags = flavorInput
    ? flavorInput.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
    : [];

  // 3. Insert into Supabase
  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    coffee_id: coffeeId,
    rating,
    body,
    flavor_tags: flavorTags,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to submit review");
  }

  // 4. Refresh the page to show the new review
  revalidatePath(`/coffees/${coffeeId}`);
}