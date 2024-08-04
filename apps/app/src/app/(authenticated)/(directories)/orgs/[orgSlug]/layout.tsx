import { cn } from "@mapform/lib/classnames";
import {
  ChevronDownIcon,
  HomeIcon,
  ListOrderedIcon,
  LogOutIcon,
  MapIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { StandardLayout } from "~/components/standard-layout";
import { getUserOrgWorkspaces } from "~/data/workspaces/get-user-org-workspaces";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  params: { orgSlug: string };
}) {
  const userOrgWorkspaces = await getUserOrgWorkspaces({
    orgSlug: params.orgSlug,
  });

  const topLinks = [
    { href: `/orgs/${params.orgSlug}`, icon: HomeIcon, label: "Home" },
    {
      href: `/orgs/${params.orgSlug}/settings`,
      icon: SettingsIcon,
      label: "Settings",
    },
  ];

  const bottomLinks = [
    { href: "https://todo.com", icon: ListOrderedIcon, label: "Roadmap" },
  ];

  return (
    <StandardLayout
      bottomContent={
        <>
          <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-1">
            Resources
          </h3>
          <div className="text-sm text-stone-700">
            {bottomLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </>
      }
      currentOrgSlug={params.orgSlug}
      topContent={
        <div className="text-sm text-stone-700 space-y-4 mt-4">
          <section>
            {topLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </section>
          <section>
            <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-1">
              Workspaces
            </h3>
            <ul>
              {userOrgWorkspaces.map((workspace) => (
                <>
                  <Link
                    className="-mx-3 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between"
                    href={`/orgs/${params.orgSlug}/workspaces/${workspace.slug}`}
                    key={workspace.id}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                        <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                      </div>
                      <span className="truncate">{workspace.name}</span>
                    </div>
                  </Link>
                  <ul>
                    {workspace.forms.map((form) => (
                      <li key={form.id}>
                        <NavLink
                          href={`/forms/${form.id}`}
                          icon={MapIcon}
                          label={form.name}
                          nested
                        />
                      </li>
                    ))}
                  </ul>
                </>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      {children}
    </StandardLayout>
  );
}

function NavLink(link: {
  href: string;
  icon: LucideIcon;
  label: string;
  nested?: boolean;
}) {
  return (
    <Link
      className="-mx-3 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between"
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
