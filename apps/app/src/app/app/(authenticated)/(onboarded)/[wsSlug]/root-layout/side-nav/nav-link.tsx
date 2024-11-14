import { cn } from "@mapform/lib/classnames";
import type { LucideIcon } from "lucide-react";
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
        "-mx-2 mb-[2px] flex items-center justify-between rounded px-3 py-1.5 transition-colors hover:bg-stone-100",
        {
          "bg-stone-100 text-stone-900": link.isActive,
        },
      )}
      href={link.href}
    >
      <div
        className={cn("flex items-center gap-2 overflow-hidden", {
          "pl-4": link.nested,
        })}
      >
        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
          <link.icon className="h-4 w-4 flex-shrink-0" />
        </div>
        <span className="truncate">{link.label}</span>
      </div>
    </Link>
  );
}
