import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import Image from "next/image";
import CentralPark from "./central-park.jpg";

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
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="flex justify-center">
            <Card
              className="z-20 -rotate-6"
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

            <Card className="z-10 rotate-6" emoji="🌳" title="Central Park">
              <Skeleton className="h-4 w-full" pulse={false} />
              <Skeleton className="mb-4 h-4 w-1/2" pulse={false} />

              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <Image
                  src={CentralPark}
                  alt="Central Park"
                  fill
                  className="object-cover opacity-50 blur-lg brightness-125"
                />
              </div>
            </Card>

            <Card className="-rotate-6" emoji="🖼️" title="MoMA">
              <Skeleton className="h-4 w-full" pulse={false} />
              <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
              <Skeleton className="mb-4 h-4 w-full" pulse={false} />
              <Skeleton className="h-4 w-full" pulse={false} />
              <Skeleton className="h-4 w-[calc(100%-20px)]" pulse={false} />
              <Skeleton className="h-4 w-1/2" pulse={false} />
            </Card>
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
  );
};
