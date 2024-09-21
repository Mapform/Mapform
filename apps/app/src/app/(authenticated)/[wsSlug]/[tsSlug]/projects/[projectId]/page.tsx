"use client";

import { cn } from "@mapform/lib/classnames";
import { MapProvider } from "@mapform/mapform";
import { notFound } from "next/navigation";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { MapFormContent, MapFormMap, useMapForm } from "@mapform/mapform";
import { ProjectProvider } from "./context";
import Project from "./project";

export default async function Page({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; projectId: string };
}) {
  // const { projectId } = params;
  // const projectWithPagesResponse = await getProjectWithPages({
  //   id: projectId,
  // });
  // const projectWithPages = projectWithPagesResponse?.data;

  // if (!projectWithPages) {
  //   return notFound();
  // }

  // TODO: Fetch points per page
  const { setCurrentPage, ...rest } = useMapForm();

  console.log(123, rest);

  return <div>Test</div>;
}
