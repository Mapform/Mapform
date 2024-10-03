import Link from "next/link";
import { TabLinks } from "./tab-links";
import { Button } from "@mapform/ui/components/button";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type PathLink = {
  name: string;
  href: string;
};

export interface TabsProps {
  pathNav: PathLink[];
  tabs?: { name: string; href: string; isExternal?: boolean }[];
  children: React.ReactNode;
  action?: React.ReactNode;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
}

export function Tabs({
  pathNav,
  tabs = [],
  action,
  children,
  showNav,
  setShowNav,
}: TabsProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between relative py-2 pl-4 pr-2 border-b h-[50px]">
        <div className="flex items-center">
          <div className="mr-2 text-muted-foreground">
            <Button
              onClick={() => setShowNav((prev) => !prev)}
              size="icon-sm"
              variant="ghost"
            >
              {showNav ? (
                <ChevronsLeftIcon className="size-4" />
              ) : (
                <ChevronsRightIcon className="size-4" />
              )}
            </Button>
          </div>
          <h3 className="flex items-center text-base font-semibold leading-6 text-stone-900">
            {/* {name} */}
            {pathNav.map((section, index) => {
              return (
                <div key={section.name}>
                  {section.href ? (
                    <Link href={section.href}>{section.name}</Link>
                  ) : (
                    section.name
                  )}
                  {index < pathNav.length - 1 && (
                    <span className="mx-3 text-stone-200 text-sm">/</span>
                  )}
                </div>
              );
            })}
          </h3>
          <nav className="flex space-x-1 mx-8">
            <TabLinks tabs={tabs} />
          </nav>
        </div>
        <div>{action}</div>
      </div>
      <div className="flex flex-col flex-1 p-4 overflow-hidden">{children}</div>
    </div>
  );
}
