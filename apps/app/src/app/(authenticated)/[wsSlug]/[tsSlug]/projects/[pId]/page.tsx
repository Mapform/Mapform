import { cn } from "@mapform/lib/classnames";
import { MapProvider } from "@mapform/mapform";
import { notFound } from "next/navigation";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { ProjectProvider } from "./context";
import Project from "./project";

export default async function Workspace({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
  searchParams?: {
    p?: string;
  };
}) {
  const { pId } = params;
  const projectWithPagesResponse = await getProjectWithPages({
    id: pId,
  });
  const projectWithPages = projectWithPagesResponse?.data;

  if (!projectWithPages) {
    return notFound();
  }

  // TODO: Fetch points per page

  return (
    <div className="-m-4 flex flex-col flex-1 overflow-hidden">
      <MapProvider>
        <ProjectProvider points={[]} projectWithPages={projectWithPages}>
          <div
            className={cn("flex flex-col flex-1 overflow-hidden bg-background")}
          >
            <Project />
          </div>
        </ProjectProvider>
      </MapProvider>
    </div>
  );
}
