import { Skeleton } from "@mapform/ui/components/skeleton";
import { Card } from "./card";
import { Label } from "@mapform/ui/components/label";

export function Forms() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Show and <span className="line-through">tell</span> ask.
          </p>
          <p className="text-muted-foreground mt-4 text-xl leading-8">
            Enable your audience to ask questions and get answers you can show
            on your map.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <Card
              className="z-20 h-[356px] -rotate-1"
              emoji="💬"
              title="Community Feedback Form"
            >
              <div className="mb-4 flex flex-col gap-2">
                <Label className="!m-0 text-base">What&apos;s your name?</Label>
                <div className="file:bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"></div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="!m-0 text-base">
                  Where&apos;s your favourite place?
                </Label>
                <div className="flex h-9 w-full items-center justify-center rounded-md border bg-stone-100 text-sm font-medium text-stone-700">
                  Select on Map
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
