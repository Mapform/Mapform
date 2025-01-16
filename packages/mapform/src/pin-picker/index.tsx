import { Drawer } from "~/drawer";

interface PinPickerProps {
  open: boolean;
  onClose: () => void;
}

export function PinPicker({ open, onClose }: PinPickerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="max-md:fixed max-md:top-0 max-md:h-screen max-md:rounded-none"
    >
      Test
    </Drawer>
  );
}
