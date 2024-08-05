import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";
import { CreateDialog } from "./dialog";
import WorkspaceLayout from "./workspace-layout";

export default async function WorkspaceForms({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string };
}) {
  const session = await auth();

  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: params.workspaceSlug,
      organization: {
        slug: params.orgSlug,
        members: {
          some: {
            userId: session?.user?.id,
          },
        },
      },
    },
    include: {
      forms: {
        where: {
          isRoot: true,
        },
        include: {
          _count: {
            select: { formSubmission: true },
          },
        },
      },
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <WorkspaceLayout
      action={<CreateDialog workspaceId={workspace.id} />}
      name={workspace.name}
      orgSlug={params.orgSlug}
      workspaceId={workspace.id}
      workspaceSlug={params.workspaceSlug}
    >
      <ul className="flex flex-wrap gap-4">
        {workspace.forms.map((form) => (
          <li className="overflow-hidden rounded-xl border w-72" key={form.id}>
            <Link
              href={`/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}/forms/${form.id}`}
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                {form.name}
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Form Submissions</dt>
                  <dd className="text-gray-700">
                    {form._count.formSubmission}
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">
                    <time dateTime={workspace.createdAt.toDateString()}>
                      {format(form.createdAt, "MMMM do, yyyy")}
                    </time>
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </WorkspaceLayout>
  );
}
