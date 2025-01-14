import { FormLabel } from "@mapform/ui/components/form";
import { AsteriskIcon } from "lucide-react";

interface LabelProps {
  editable: boolean;
  label: string;
  required: boolean;
  onLabelChange: (label: string) => void;
}

export function Label({
  editable,
  label,
  required,
  onLabelChange,
}: LabelProps) {
  if (editable) {
    return (
      <div className="flex justify-between">
        <input
          className="flex-1 border-0 border-transparent bg-transparent p-0 text-base font-medium placeholder-gray-300 outline-none focus:border-transparent focus:ring-0"
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Type a question"
          value={label}
        />
        {required ? <AsteriskIcon height={14} width={14} /> : null}
      </div>
    );
  }

  return (
    <FormLabel className="flex justify-between">
      {label}
      {required ? <AsteriskIcon height={14} width={14} /> : null}
    </FormLabel>
  );
}
