import { notFound } from "next/navigation";
import {
  BoxIcon,
  ChevronRightIcon,
  GithubIcon,
  LifeBuoyIcon,
  MapIcon,
  ScrollIcon,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "~/lib/safe-action";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { CreateProjectDropdown } from "~/components/create-project-dialog";
import { Button } from "@mapform/ui/components/button";
import { WelcomeTour } from "./welcome-tour";

export default async function HomePage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [getWorkspaceDirectoryResponse, recentProjectsResponse] =
    await Promise.all([
      getWorkspaceDirectory({
        slug: params.wsSlug,
      }),
      authClient.getRecentProjects({
        workspaceSlug: params.wsSlug,
      }),
    ]);
  const workspaceDirectory = getWorkspaceDirectoryResponse?.data;
  const recentProjects = recentProjectsResponse?.data ?? [];

  if (!workspaceDirectory) {
    return notFound();
  }

  return (
    <>
      <div className="@container overflow-y-auto p-4">
        <div className="mx-auto max-w-screen-md space-y-12">
          <section className="@4xl:overflow-visible overflow-hidden">
            {recentProjects.length ? (
              <>
                <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                  Recent
                </h3>
                <ul className="flex flex-col space-y-2 divide-y">
                  {recentProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        className="flex items-center justify-between rounded-lg px-4 py-2 font-medium text-gray-900 shadow"
                        href={`/app/${params.wsSlug}/${project.id}/${project.views.find((v) => v.position === 0)?.id}`}
                      >
                        <span className="truncate">
                          {project.name || "Untitled"}
                        </span>
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 duration-200 group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
                <div className="text-center">
                  <BoxIcon className="mx-auto size-8 text-gray-400" />
                  <h3 className="text-foreground mt-2 text-sm font-medium">
                    No projects yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new project.
                  </p>
                  <CreateProjectDropdown
                    tsSlug={workspaceDirectory.teamspaces[0]!.slug}
                  >
                    <Button className="mt-4" size="sm">
                      Create Project
                    </Button>
                  </CreateProjectDropdown>
                </div>
              </div>
            )}
          </section>
          <section>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Links and resources
            </h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* PRODUCTLANE ROADMAP */}
              <Link
                className="group"
                href="https://mapform.productlane.com/roadmap"
                target="_blank"
              >
                <div className="flex overflow-hidden rounded-lg shadow duration-200 group-hover:opacity-80 group-hover:shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center bg-indigo-200">
                    <MapIcon className="h-6 w-6 text-indigo-700 duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate bg-white pl-4 pr-3">
                    <div className="">
                      <h6 className="text-base font-medium text-gray-900">
                        Roadmap
                      </h6>
                      <p className="text-sm text-gray-500">
                        See where Mapform is headed.
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* CHANGELOG */}
              <Link
                className="group"
                href="https://mapform.productlane.com/changelog"
                target="_blank"
              >
                <div className="flex overflow-hidden rounded-lg shadow duration-200 group-hover:opacity-80 group-hover:shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center bg-pink-200">
                    <ScrollIcon className="h-6 w-6 text-pink-700 duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate bg-white pl-4 pr-3">
                    <div className="">
                      <h6 className="text-base font-medium text-gray-900">
                        Changelog
                      </h6>
                      <p className="text-sm text-gray-500">
                        Be the first to get updates.
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* SUPPORT */}
              <Link
                className="group"
                href="mailto:support@mapform.co"
                target="_blank"
              >
                <div className="flex overflow-hidden rounded-lg shadow duration-200 group-hover:opacity-80 group-hover:shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center bg-yellow-200">
                    <LifeBuoyIcon className="h-6 w-6 text-yellow-700 duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate bg-white pl-4 pr-3">
                    <div className="">
                      <h6 className="text-base font-medium text-gray-900">
                        Support
                      </h6>
                      <p className="text-sm text-gray-500">
                        React out for help or feedback.
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* GITHUB */}
              <Link
                className="group"
                href="https://github.com/Mapform/Mapform"
                target="_blank"
              >
                <div className="flex overflow-hidden rounded-lg shadow duration-200 group-hover:opacity-80 group-hover:shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center bg-green-200">
                    <GithubIcon className="h-6 w-6 text-green-700 duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate bg-white pl-4 pr-3">
                    <div className="">
                      <h6 className="text-base font-medium text-gray-900">
                        Github
                      </h6>
                      <p className="text-sm text-gray-500">
                        Check out the source code.
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <WelcomeTour />
    </>
  );
}
