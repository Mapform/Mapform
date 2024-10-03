import { Skeleton } from "@mapform/ui/components/skeleton";
import { ListOrderedIcon } from "lucide-react";
import { Suspense } from "react";
import { Switcher } from "./switcher";
import { NavLink } from "./nav-link";
import { NavTop } from "./nav-top";

const bottomLinks = [
  { href: "https://todo.com", icon: ListOrderedIcon, label: "Roadmap" },
];

export function SideNav({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto bg-stone-50 px-4 py-2 w-[300px] border-r">
      <nav className="flex flex-1 flex-col">
        <Suspense fallback={<Skeleton className="h-7 w-full rounded" />}>
          <Switcher workspaceSlug={workspaceSlug} />
        </Suspense>
        <NavTop />
        <div className="mt-auto">
          <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1">
            Resources
          </h3>
          <div className="text-sm text-stone-700">
            {bottomLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
