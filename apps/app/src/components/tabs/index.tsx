import { Skeleton } from "@mapform/ui/components/skeleton";
import { TabLinks } from "./tab-links";

interface TabsProps {
  name?: string;
  isLoading?: boolean;
  tabs: { name: string; href: string }[];
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Tabs({ name, isLoading, tabs, action, children }: TabsProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="md:flex md:items-center md:justify-between relative pt-4 px-4">
        {isLoading ? (
          <Skeleton className="w-48 h-6" />
        ) : (
          <h3 className="text-base font-semibold leading-6 text-stone-900">
            {name}
          </h3>
        )}
        <div className="absolute top-4 right-4">{action}</div>
      </div>
      <div className="mt-4 border-b border-gray-200">
        <div className="sm:hidden">
          <label className="sr-only" htmlFor="current-tab">
            Select a tab
          </label>
          <select className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary">
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <TabLinks tabs={tabs} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 overflow-hidden">{children}</div>
    </div>
  );
}
