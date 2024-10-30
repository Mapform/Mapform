import { ConstructionIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-4">
      <div className="flex w-full items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <ConstructionIcon className="size-6" />
          <p>This page is under construction</p>
        </div>
      </div>
    </div>
  );
}
