"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // <--- THIS WAS MISSING
import { Loader2, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createCoffee } from "./actions";

// Update props to accept the user submission flag
export function AddCoffeeForm({
    roasters,
    isUserSubmission = false
}: {
    roasters: any[],
    isUserSubmission?: boolean
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [roasterMode, setRoasterMode] = useState("existing"); // 'existing' | 'new'

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append("roasterMode", roasterMode);

        try {
            const result = await createCoffee(formData);

            // Handle Redirect (For Users)
            if (result?.redirectUrl) {
                toast.success("Coffee added! You can now review it.");
                router.push(result.redirectUrl);
            } else {
                // Handle Admin Success
                toast.success("Coffee published successfully!");
                (event.target as HTMLFormElement).reset();
                // Optional: If admin, we might want to refresh data without full reload
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add coffee. Check the console.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Coffee Name</Label>
                <Input id="name" name="name" placeholder="e.g. Holler Mountain" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Roaster Section */}
                <div className="space-y-2">
                    <Label>Roaster</Label>
                    <Tabs defaultValue="existing" onValueChange={setRoasterMode} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="existing">Select Existing</TabsTrigger>
                            <TabsTrigger value="new">Create New</TabsTrigger>
                        </TabsList>

                        <TabsContent value="existing">
                            <Select name="roasterId" required={roasterMode === "existing"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select roaster..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roasters.map((r) => (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TabsContent>

                        <TabsContent value="new">
                            <div className="relative">
                                <Input
                                    name="newRoasterName"
                                    placeholder="Enter new roaster name"
                                    required={roasterMode === "new"}
                                />
                                <Plus className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Roast Level */}
                <div className="space-y-2">
                    <Label>Roast Level</Label>
                    <Select name="roastLevel" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Light">Light</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Dark">Dark</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Process */}
            <div className="space-y-2">
                <Label htmlFor="process">Process (Optional)</Label>
                <Input id="process" name="process" placeholder="e.g. Washed, Natural" />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label htmlFor="image">Product Image {isUserSubmission && "(Optional)"}</Label>
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300 transition-colors"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                            <p className="text-sm text-slate-500">
                                <span className="font-semibold">Click to upload</span>
                            </p>
                        </div>
                        {/* Remove 'required' if it's a user submission, based on your strategy preference */}
                        <input
                            id="image"
                            name="image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            required={!isUserSubmission}
                        />
                    </label>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    isUserSubmission ? "Submit Coffee" : "Publish Coffee"
                )}
            </Button>
        </form>
    );
}