import { FormLabel } from "@mapform/ui/components/form";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
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
        <AutoSizeTextArea
          className="p-0 text-base font-medium placeholder-gray-300"
          value={label}
          onChange={onLabelChange}
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
