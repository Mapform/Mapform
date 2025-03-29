import { Button } from "@mapform/ui/components/button";
import { Badge } from "@mapform/ui/components/badge";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { Globe } from "./globe";
import { ArrowUpRightIcon } from "lucide-react";

export function Hero() {
  return (
    <div className="mb-16 flex h-full w-full flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <section className="lg:flex lg:items-center lg:gap-x-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center sm:items-baseline sm:text-left lg:mx-0 lg:flex-auto">
            <span className="flex-grow-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className="bg-white max-lg:shadow-sm"
                    variant="outline"
                  >
                    Now in <span className="ml-1 underline">Beta</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">
                  Mapform is still in early development. Be one of the first to
                  try it out and provide feedback!
                </TooltipContent>
              </Tooltip>
            </span>
            <div className="lg:max-w-[500px]">
              <h1 className="text-foreground mt-4 text-5xl font-medium lg:text-7xl">
                The Workspace For Place.
              </h1>
              <p className="text-muted-foreground mb-10 mt-4 text-xl leading-8 sm:mb-10 sm:mt-6 sm:text-2xl">
                {/* Mapform helps you track, manage, and share the places that
                matter to you. */}
                Mapform combines data, content, forms, and more to create maps
                for anything.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:justify-start">
              <Link className="max-lg:shadow-sm" href="/app" target="_blank">
                <Button size="lg">Try it out</Button>
              </Link>
              <Link
                href="mailto:contact@mapform.co?subject=I'd like to learn more about Mapform"
                target="_blank"
              >
                <Button
                  className="max-lg:shadow-sm"
                  size="lg"
                  variant="secondary"
                >
                  Contact <ArrowUpRightIcon className="ml-1 size-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-15 max-lg:h-screen max-lg:w-screen lg:relative lg:z-0 lg:mt-0 lg:size-[550px] lg:flex-shrink-0 lg:flex-grow lg:opacity-100">
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <Globe />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
