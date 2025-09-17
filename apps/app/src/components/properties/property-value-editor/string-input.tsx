import { Input } from "@mapform/ui/components/input";

type Props = {
  value: string | null | undefined;
  onChange: (value: string) => void;
};

function StringInput({ value, onChange }: Props) {
  return (
    <Input
      className="border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default StringInput;
