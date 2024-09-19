import Link from "next/link";
import { db } from "@mapform/db";
import { eq, and } from "@mapform/db/utils";
import { workspaces } from "@mapform/db/schema";
import { auth } from "~/lib/auth";

export default async function Organization({
  params,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const currentWorkspace = await db.query.workspaces.findFirst({
    where: and(eq(workspaces.slug, params.wsSlug)),
    with: {
      teamspaces: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!currentWorkspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-base font-semibold leading-6 text-stone-900 mb-4">
        {currentWorkspace.name}
      </h3>
      <ul className="flex flex-wrap gap-4">
        {currentWorkspace.teamspaces.map((teamspace) => (
          <li
            className="overflow-hidden rounded-xl border w-72"
            key={teamspace.id}
          >
            <Link href={`/orgs/${params.wsSlug}/workspaces/${teamspace.slug}`}>
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                {teamspace.name}
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-stone-500">Forms</dt>
                  {/* <dd className="text-stone-700">{workspace._count.forms}</dd> */}
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-stone-500">Created</dt>
                  <dd className="text-stone-700">
                    {/* <time dateTime={workspace.createdAt.toDateString()}>
                      {format(workspace.createdAt, "MMMM do, yyyy")}
                    </time> */}
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
