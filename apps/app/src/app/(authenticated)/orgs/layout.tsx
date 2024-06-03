import { TopBar } from "~/components/top-bar";
import { CreateDialog } from "./dialog";
import { getUserOrgs } from "./requests";
import ActiveLinks from "./active-links";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userOrgs = await getUserOrgs();

  return (
    <div className="flex flex-col flex-1">
      <TopBar />
      <div className="flex flex-1">
        {/* NAV */}
        <div className="flex flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 w-[300px]">
          <nav className="flex flex-1 flex-col mt-6">
            <h3 className="text-xs font-semibold leading-6 text-gray-400">
              Teams
            </h3>
            <ActiveLinks userOrgs={userOrgs} />
            <CreateDialog />
          </nav>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
