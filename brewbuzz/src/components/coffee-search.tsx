"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CoffeeSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleFilter(roast: string) {
    const params = new URLSearchParams(searchParams);
    if (roast && roast !== "all") {
      params.set("roast", roast);
    } else {
      params.delete("roast");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Input
        placeholder="Search coffees or roasters..."
        className="flex-1"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
      <div className="w-full sm:w-[180px]">
        <Select
          onValueChange={handleFilter}
          defaultValue={searchParams.get("roast")?.toString() || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Roast Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roasts</SelectItem>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}