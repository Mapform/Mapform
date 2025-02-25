import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import Image from "next/image";
import CentralPark from "./central-park.jpg";
import MapBackground from "./map.png";
import { MapPinIcon, PinIcon } from "lucide-react";

export function Storytelling() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Tell a story.
          </p>
          <p className="text-muted-foreground mt-4 text-xl leading-8">
            Mapform goes beyond just maps. Combine data, text, and images into
            an interactive storytelling experience.
          </p>
        </div>
      </div>

      {/* Map section with cards */}
      <div className="relative">
        {/* Map background */}
        {/* <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={MapBackground}
            alt="Map of New York"
            fill
            className="object-cover opacity-50 blur-sm"
            priority
          />
        </div> */}

        {/* Cards content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex flex-wrap items-center justify-center">
              <Card
                className="z-20 h-[356px] -rotate-6"
                emoji="🗽"
                title="Trip to New York"
              >
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
                <Skeleton className="mb-4 h-4 w-full" pulse={false} />
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
                <Skeleton className="h-4 w-1/2" pulse={false} />
              </Card>

              <Card
                className="z-10 h-[356px] rotate-6"
                emoji="🌳"
                title="Central Park"
              >
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="mb-4 h-4 w-1/2" pulse={false} />

                <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                  <Image
                    src={CentralPark}
                    alt="Central Park"
                    fill
                    className="object-cover opacity-50 blur-lg brightness-125"
                  />
                </div>
              </Card>

              <Card className="h-[356px] -rotate-6" emoji="🖼️" title="MoMA">
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="mb-4 h-4 w-1/2" pulse={false} />
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
                <Skeleton className="h-4 w-full" pulse={false} />
                <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
                <Skeleton className="h-4 w-1/2" pulse={false} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Card = ({
  emoji,
  title,
  children,
  className,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "w-[300px] rounded-2xl border bg-white p-4 shadow-lg",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <span className="text-6xl">{emoji}</span>
          <h3 className="mb-4 text-3xl font-semibold">{title}</h3>
          {children}
        </div>
      </div>

      {/* <div className="mx-auto mt-4 flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
        <MapPinIcon className="size-5 text-white" fill="currentColor" />
      </div> */}
    </div>
  );
};
