import { prisma } from "@mapform/db";
import { headers } from "next/headers";
import { cn } from "@mapform/lib/classnames";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { TopBar } from "~/components/top-bar";
import { CreateDialog } from "./dialog";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = headers();
  const pathname = header.get("next-url");
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const userOrgs = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      organizationMemberships: {
        include: {
          organization: {
            include: {
              workspaces: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col flex-1">
      <TopBar />
      <div className="flex flex-1">
        {/* NAV */}
        <div className="flex flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 w-[300px]">
          <nav className="flex flex-1 flex-col">
            <ul className="-mx-2 mt-2 space-y-1">
              {userOrgs?.organizationMemberships.map((membership) => (
                <li key={membership.organization.id}>
                  <Link
                    className={cn(
                      pathname === membership.organization.slug
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                    href={`/${membership.organization.slug}`}
                  >
                    <span
                      className={cn(
                        pathname === membership.organization.slug
                          ? "text-indigo-600 border-indigo-600"
                          : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                      )}
                    >
                      {membership.organization.name[0]}
                    </span>
                    <span className="truncate">
                      {membership.organization.name}
                    </span>
                  </Link>
                  <ul className="ml-8 space-y-1">
                    {membership.organization.workspaces.map((workspace) => (
                      <li key={workspace.id}>
                        <Link
                          className={cn(
                            pathname === workspace.slug
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                          href={`/${membership.organization.slug}/${workspace.slug}`}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <CreateDialog />
          </nav>
        </div>

        {/* CONTENT */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
