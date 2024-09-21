import { cn } from "@mapform/lib/classnames";
import { notFound } from "next/navigation";
import { MapForm } from "@mapform/mapform";
import { Tabs } from "~/components/tabs";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
// import { getProjectWithTeamspace } from "~/data/projects/get-project-with-teamspace";
import { ProjectProvider } from "./context";

export default async function Layout({
  params,
  children,
  actions,
}: {
  params: { wsSlug: string; tsSlug: string; projectId: string };
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const { projectId } = params;
  const projectWithPagesResponse = await getProjectWithPages({
    id: projectId,
  });
  const projectWithPages = projectWithPagesResponse?.data;

  if (!projectWithPages) {
    return notFound();
  }

  const tabs = [
    {
      name: "Create",
      href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.projectId}`,
    },
    {
      name: "Submissions",
      // TODO: Need to add ${project.datasetId} when relationship added
      href: `/orgs/${params.wsSlug}/${params.tsSlug}/datasets/`,
      isExternal: true,
    },
  ];

  return (
    <Tabs
      action={actions}
      nameSections={[
        // {
        //   name: project.teamspace.name,
        //   href: `/${params.wsSlug}/${params.tsSlug}`,
        // },
        { name: projectWithPages.name },
      ]}
      tabs={tabs}
    >
      <div className="-m-4 flex flex-col flex-1 overflow-hidden">
        <MapForm>
          <ProjectProvider points={[]} projectWithPages={projectWithPages}>
            <div
              className={cn(
                "flex flex-col flex-1 overflow-hidden bg-background"
              )}
            >
              {children}
            </div>
          </ProjectProvider>
        </MapForm>
      </div>
    </Tabs>
  );
}
