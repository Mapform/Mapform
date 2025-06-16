import { notFound } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<{ v: string }>;
}) {
  const params = await props.params;
  const project = await authClient.getProject({
    projectId: params.pId,
  });

  if (!project) {
    return notFound();
  }

  console.log(1111, project);

  return <div>{project.data?.id}</div>;
}
