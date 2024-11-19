import Link from "next/link";
import { format } from "date-fns";
import { MapIcon } from "lucide-react";
import { getTeamspaceWithProjectsAction } from "~/data/teamspaces/get-teamspace-with-projects";

export default async function WorkspaceForms(props: {
  params: Promise<{ wsSlug: string; tsSlug: string }>;
}) {
  const params = await props.params;
  const teamspaceResponse = await getTeamspaceWithProjectsAction({
    workspaceSlug: params.wsSlug,
    teamspaceSlug: params.tsSlug,
  });
  const teamspace = teamspaceResponse?.data;

  if (!teamspace) {
    return <div>Workspace not found</div>;
  }

  if (!teamspace.projects.length) {
    return (
      <div className="flex flex-1 flex-col justify-center pb-8">
        <div className="text-center">
          <MapIcon className="mx-auto size-8 text-gray-400" />
          <h3 className="text-foreground mt-2 text-sm font-semibold">
            No projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4">
      <ul className="flex flex-wrap gap-4">
        {teamspace.projects.map((project) => (
          <li
            className="w-72 overflow-hidden rounded-xl border"
            key={project.id}
          >
            <Link
              href={`/app/${params.wsSlug}/${params.tsSlug}/projects/${project.id}`}
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
    </div>
  );
}
