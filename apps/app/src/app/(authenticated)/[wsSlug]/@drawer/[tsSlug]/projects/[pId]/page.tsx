import { notFound } from "next/navigation";
import { cache } from "react";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { PagePicker } from "./page-picker";
import { ProjectProvider } from "./project-context";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await getProjectWithPages({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  if (!projectWithPages) {
    return notFound();
  }

  return projectWithPages;
});

export default async function Drawer({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
}) {
  const projectWithPages = await fetchProjectWithPages(params.pId);

  return (
    <ProjectProvider projectWithPages={projectWithPages}>
      <div className="flex flex-col w-[300px] flex-shrink-0 px-4 pb-2 border-l">
        <div className="h-[50px] flex items-center">
          <h3 className="font-semibold">Pages</h3>
        </div>
        <PagePicker />
      </div>
    </ProjectProvider>
  );
}
