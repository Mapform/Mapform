import { Input } from "@mapform/ui/components/input";

type Props = {
  value: number | string | null | undefined;
  onChange: (value: number | null) => void;
};

function NumberInput({ value, onChange }: Props) {
  return (
    <Input
      className="5 border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "") return onChange(null);
        const n = Number(v);
        onChange(Number.isNaN(n) ? null : n);
      }}
    />
  );
}

export default NumberInput;
