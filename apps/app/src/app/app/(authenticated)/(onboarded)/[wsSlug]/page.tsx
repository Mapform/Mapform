import { notFound } from "next/navigation";
import {
  BookOpenIcon,
  ChevronRightIcon,
  GithubIcon,
  LifeBuoyIcon,
  MapIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  ScrollIcon,
} from "lucide-react";
import { getWorkspaceDirectoryAction } from "~/data/workspaces/get-workspace-directory";
import Link from "next/link";

export default async function HomePage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const getWorkspaceDirectoryResponse = await getWorkspaceDirectoryAction({
    slug: params.wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceDirectoryResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <div className="@container overflow-y-auto p-4">
      <div className="mx-auto max-w-screen-md space-y-12">
        <section className="flex items-center justify-center rounded-2xl bg-gray-50 px-4 py-6">
          <div className="prose">
            <h4>Maker&apos;s note</h4>
            <p>
              Hey there, thanks for checking out Mapform. I started hacking on
              it in early 2024, and felt it was time to lift the curtain — even
              though it&apos;s not quite ready yet. Honestly, that&apos;s a
              tough thing to do, but I believe it&apos;s important to start
              getting feedback to make the product the best it can be.
            </p>
            <p>
              So if you find any bugs (and you will) or have feedback, I&apos;d
              love to hear from you. Until then, happy mapping!
            </p>
            <p>
              <strong>— Nic</strong>
            </p>
          </div>
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
                    <h6 className="text-base font-semibold text-zinc-900">
                      Roadmap
                    </h6>
                    <p className="text-sm text-zinc-500">
                      See where Mapform is headed.
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 duration-200 group-hover:translate-x-1" />
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
                    <h6 className="text-base font-semibold text-zinc-900">
                      Changelog
                    </h6>
                    <p className="text-sm text-zinc-500">
                      Be the first to get updates.
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 duration-200 group-hover:translate-x-1" />
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
                    <h6 className="text-base font-semibold text-zinc-900">
                      Support
                    </h6>
                    <p className="text-sm text-zinc-500">
                      React out for help or feedback.
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 duration-200 group-hover:translate-x-1" />
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
                    <h6 className="text-base font-semibold text-zinc-900">
                      Github
                    </h6>
                    <p className="text-sm text-zinc-500">
                      Check out the source code.
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
