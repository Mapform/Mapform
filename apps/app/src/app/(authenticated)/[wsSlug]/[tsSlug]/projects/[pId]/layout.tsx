import { Tabs } from "~/components/tabs";
import { getProjectWithTeamspace } from "~/data/projects/get-project-with-teamspace";

export default async function Layout({
  params,
  children,
  actions,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const projectResponse = await getProjectWithTeamspace({
    id: params.pId,
  });
  const project = projectResponse?.data;

  if (!project) {
    return null;
  }

  const tabs = [
    {
      name: "Create",
      href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}`,
    },
    {
      name: "Submissions",
      href: `/${params.wsSlug}/${params.tsSlug}/datasets/${project.}`,
      isExternal: true,
    },
  ];

  return (
    <Tabs
      action={actions}
      nameSections={[
        {
          name: project.teamspace.name,
          href: `/${params.wsSlug}/${params.tsSlug}`,
        },
        { name: project.name },
      ]}
      tabs={tabs}
    >
      {children}
    </Tabs>
  );
}
