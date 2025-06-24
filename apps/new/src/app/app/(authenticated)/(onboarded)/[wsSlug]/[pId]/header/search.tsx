import { Input } from "@mapform/ui/components/input";
import { cn } from "@mapform/lib/classnames";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export function Search() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="-mx-6 -mt-6 border-b">
      <div className="relative z-20 m-2 flex items-center gap-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="hover:bg-muted focus:bg-muted w-full border-none pl-10 shadow-none"
          placeholder="Search or ask..."
        />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg transition-all duration-300",
          {
            "pointer-events-auto bg-white/80 backdrop-blur-sm": searchFocused,
            "pointer-events-none bg-white/0 backdrop-blur-none": !searchFocused,
          },
        )}
      ></div>
    </div>
  );
}
