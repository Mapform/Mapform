import { TriangleAlertIcon } from "lucide-react";

interface DisconnectedProps {
  label: string;
}

export function Disconnected({ label }: DisconnectedProps) {
  return (
    <div className="text-muted-foreground mb-4 flex gap-2 rounded-md bg-gray-100 p-3">
      <TriangleAlertIcon className="mt-1 size-4 flex-shrink-0" />

      <div className="">
        <div className="mb-1 text-base font-medium">{label}</div>
        <div className="text-sm">
          This question has been deleted from your submissions dataset.
        </div>
      </div>
    </div>
  );
}
