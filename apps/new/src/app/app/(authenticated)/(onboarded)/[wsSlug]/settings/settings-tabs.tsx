"use client";

import { Tabs, TabsList, TabsTrigger } from "@mapform/ui/components/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsTabs({ wsSlug }: { wsSlug: string }) {
  const pathname = usePathname();

  const currentTab = pathname.split("/").pop();

  return (
    <Tabs className="w-full" value={currentTab}>
      <TabsList className="w-full">
        <Link className="w-full no-underline" href={`/app/${wsSlug}/settings`}>
          <TabsTrigger className="w-full" value="settings">
            Workspace
          </TabsTrigger>
        </Link>
        <Link
          className="w-full no-underline"
          href={`/app/${wsSlug}/settings/usage`}
        >
          <TabsTrigger className="w-full" value="usage">
            Usage
          </TabsTrigger>
        </Link>
        <Link
          className="w-full no-underline"
          href={`/app/${wsSlug}/settings/billing`}
        >
          <TabsTrigger className="w-full" value="billing">
            Billing
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
