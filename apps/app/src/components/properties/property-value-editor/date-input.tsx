import { DateTimePicker } from "@mapform/ui/components/datetime-picker";

type Props = {
  value: Date | null | undefined;
  onChange: (value: Date | null) => void;
};

function DateInput({ value, onChange }: Props) {
  return (
    <DateTimePicker
      value={value ?? undefined}
      onChange={(v) => onChange(v ?? null)}
    />
  );
}

export default DateInput;
