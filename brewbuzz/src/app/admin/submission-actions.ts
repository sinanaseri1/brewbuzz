"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to check admin status
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") throw new Error("Unauthorized");
    return supabase;
}

export async function approveSubmission(id: string) {
    const supabase = await checkAdmin();

    const { error } = await supabase
        .from("coffees")
        .update({ is_public: true })
        .eq("id", id);

    if (error) throw new Error("Failed to approve");

    revalidatePath("/admin");
    revalidatePath("/coffees");
}

export async function rejectSubmission(id: string) {
    const supabase = await checkAdmin();

    // Hard delete the submission
    const { error } = await supabase
        .from("coffees")
        .delete()
        .eq("id", id);

    if (error) throw new Error("Failed to reject");

    revalidatePath("/admin");
}