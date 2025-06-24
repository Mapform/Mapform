import { Input } from "@mapform/ui/components/input";
import { SearchIcon } from "lucide-react";

export function Search() {
  return (
    <div className="-mx-6 -mt-6 border-b">
      <div className="relative m-2 flex items-center gap-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          className="hover:bg-muted w-full border-none pl-10 shadow-none"
          placeholder="Search or ask..."
        />
      </div>
    </div>
  );
}
