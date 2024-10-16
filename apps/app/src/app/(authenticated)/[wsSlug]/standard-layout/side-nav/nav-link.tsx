import { cn } from "@mapform/lib/classnames";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export function NavLink(link: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      className={cn(
        "-mx-2 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between mb-[2px]",
        {
          "bg-stone-100 text-stone-900": link.isActive,
        }
      )}
      href={link.href}
    >
      <div
        className={cn("flex items-center gap-2 overflow-hidden", {
          "pl-4": link.nested,
        })}
      >
        <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
          <link.icon className="h-4 w-4 flex-shrink-0" />
        </div>
        <span className="truncate">{link.label}</span>
      </div>
    </Link>
  );
}
