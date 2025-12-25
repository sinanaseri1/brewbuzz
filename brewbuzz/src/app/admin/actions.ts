"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoffee(formData: FormData) {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Determine Role (Admin or User)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === "admin";

    // 3. Set Visibility (Admins = Public, Users = Hidden)
    const isPublic = isAdmin;

    // 4. Extract Data
    const name = formData.get("name") as string;
    const roasterMode = formData.get("roasterMode");
    let roasterId = formData.get("roasterId") as string;
    const newRoasterName = formData.get("newRoasterName") as string;
    const roastLevel = formData.get("roastLevel") as string;
    const process = formData.get("process") as string;
    const imageFile = formData.get("image") as File;

    // 5. Handle New Roaster
    if (roasterMode === "new") {
        if (!newRoasterName) throw new Error("Roaster name is required");

        const { data: newRoaster, error: roasterError } = await supabase
            .from("roasters")
            .insert({
                name: newRoasterName,
                is_public: isPublic, // Hidden if user created it
                submitted_by: user.id
            })
            .select()
            .single();

        if (roasterError) throw new Error("Failed to create roaster");
        roasterId = newRoaster.id;
    }

    // 6. Handle Image (Optional for users?)
    // For now, let's keep it required or use a default if missing.
    let publicUrl = null;
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("coffee-images")
            .upload(filePath, imageFile);

        if (!uploadError) {
            const { data } = supabase.storage
                .from("coffee-images")
                .getPublicUrl(filePath);
            publicUrl = data.publicUrl;
        }
    }

    // 7. Insert Coffee
    const { data: newCoffee, error: dbError } = await supabase
        .from("coffees")
        .insert({
            name,
            roaster_id: roasterId,
            roast_level: roastLevel,
            process,
            image_url: publicUrl,
            is_public: isPublic, // <--- The Magic Flag
            submitted_by: user.id
        })
        .select()
        .single();

    if (dbError) throw new Error("Database insert failed");

    // 8. Redirect Logic
    revalidatePath("/coffees");

    if (isAdmin) {
        return { success: true, message: "Coffee published!" };
    } else {
        // If user, redirect to the coffee page so they can review it!
        // We use a special return object so the Client Component knows to redirect
        return { success: true, redirectUrl: `/coffees/${newCoffee.id}` };
    }
}