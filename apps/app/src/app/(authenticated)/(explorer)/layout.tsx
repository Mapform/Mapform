import { headers } from "next/headers";
import { cn } from "@mapform/lib/classnames";
import { clerkClient } from "@clerk/nextjs";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = headers();
  const pathname = header.get("next-url");
  const orgs = await clerkClient.organizations.getOrganizationList();

  return (
    <div className="flex flex-1">
      {/* NAV */}
      <div className="flex flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 w-[300px]">
        <nav className="flex flex-1 flex-col">
          <ul className="-mx-2 mt-2 space-y-1">
            {orgs.map((org) => (
              <li key={org.id}>
                <Link
                  className={cn(
                    pathname === org.slug
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                  href={org.slug}
                >
                  <span
                    className={cn(
                      pathname === org.slug
                        ? "text-indigo-600 border-indigo-600"
                        : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                    )}
                  >
                    {org.name[0]}
                  </span>
                  <span className="truncate">{org.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
