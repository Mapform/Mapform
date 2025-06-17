import { NavSlot } from "~/components/nav-slot";
import { Import } from "./import";

export default function Nav() {
  return (
    <NavSlot
      actions={
        <div className="flex items-center">
          <Import />
        </div>
      }
    />
  );
}
