import { ConstructionIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="text-muted-foreground flex flex-col gap-2 items-center">
        <ConstructionIcon className="size-6" />
        <p>This page is under construction</p>
      </div>
    </div>
  );
}
