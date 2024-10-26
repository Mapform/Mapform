import Link from "next/link";
import { format } from "date-fns";
import { getTeamspaceWithProjects } from "~/data/teamspaces/get-teamspace-with-projects";

export default async function WorkspaceForms({
  params,
}: {
  params: { wsSlug: string; tsSlug: string };
}) {
  const teamspaceResponse = await getTeamspaceWithProjects({
    workspaceSlug: params.wsSlug,
    teamspaceSlug: params.tsSlug,
  });
  const teamspace = teamspaceResponse?.data;

  if (!teamspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <ul className="flex flex-wrap gap-4">
      {teamspace.projects.map((project) => (
        <li className="w-72 overflow-hidden rounded-xl border" key={project.id}>
          <Link
            href={`/${params.wsSlug}/${params.tsSlug}/projects/${project.id}`}
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
              {project.name}
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-stone-500">Created</dt>
                <dd className="text-stone-700">
                  <time dateTime={teamspace.createdAt.toDateString()}>
                    {format(project.createdAt, "MMMM do, yyyy")}
                  </time>
                </dd>
              </div>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
