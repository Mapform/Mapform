import { Button } from "@mapform/ui/components/button";
import { Badge } from "@mapform/ui/components/badge";
import Link from "next/link";
import { Globe } from "~/components/landing/globe";
import { Nav } from "~/components/landing/nav";

export default function Page() {
  return (
    <div className="relative flex h-screen flex-col">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-20 lg:px-8">
        <section className="lg:flex lg:items-center lg:gap-x-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center sm:items-baseline sm:text-left lg:mx-0 lg:flex-auto">
            <span className="flex-grow-0">
              <Badge className="bg-white" variant="outline">
                Now in Alpha
              </Badge>
            </span>
            <h1 className="text-muted-foreground mt-4 text-4xl font-medium lg:text-6xl">
              A Place For
              <br />
              Everything.
              <br />
              <div className="text-foreground mt-4">
                Everything
                <br />
                In Its Place.
              </div>
            </h1>
            <p className="text-muted-foreground mb-10 mt-4 text-xl leading-8 sm:mb-10 sm:mt-6 sm:text-2xl">
              Mapform helps you track, manage, and share the places that matter
              to you.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:justify-start">
              <Link href="/app" target="_blank">
                <Button size="lg">Try it out</Button>
              </Link>
              <Link
                // TODO: Add link to either a blog post, docs, or social post
                href="/app"
                target="_blank"
              >
                <Button size="lg" variant="secondary">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-15 max-lg:h-screen max-lg:w-screen lg:relative lg:z-0 lg:mt-0 lg:size-[550px] lg:flex-shrink-0 lg:flex-grow lg:opacity-100">
            <div className="flex h-full w-full justify-center overflow-hidden">
              <Globe />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
