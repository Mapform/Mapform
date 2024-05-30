import Link from "next/link";
import { prisma } from "@mapform/db";
import { CreateDialog } from "./dialog";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string };
}) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: params.workspaceSlug,
      organization: {
        slug: params.orgSlug,
      },
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const forms = await prisma.form.findMany({
    where: {
      workspaceId: workspace.id,
      isPublished: false,
    },
  });

  return (
    <form>
      <h1>Workspace</h1>
      <CreateDialog workspaceId={workspace.id} />
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            <Link href={`/forms/${form.id}`}>{form.name}</Link>
          </li>
        ))}
      </ul>
    </form>
  );
}
