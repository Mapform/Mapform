import { Card } from "./card";
import { Label } from "@mapform/ui/components/label";
import { AlignLeftIcon, CircleDotIcon } from "lucide-react";

export function Forms() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
          {/* Show and <span className="line-through">tell</span> ask. */}
          Maps ↔️ Forms
        </h3>
        <p className="text-muted-foreground mt-4 text-xl leading-8">
          Forms integrate seamlessly with your maps, enabling you to collect and
          visualize locations and other user data.
        </p>
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center max-md:flex-col lg:max-w-none">
          <Card
            className="z-20 h-[356px] -rotate-2 text-left"
            emoji="💬"
            title="City Parking Feedback Form"
          >
            <div className="mb-4 flex flex-col gap-2">
              <Label className="!m-0 text-base">What&apos;s your name?</Label>
              <div className="file:bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"></div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="!m-0 text-base">
                Where do we need more parking?
              </Label>
              <div className="flex h-9 w-full items-center justify-center rounded-md border bg-stone-100 text-sm font-medium text-stone-700">
                Select on Map
              </div>
            </div>
          </Card>

          {/* Table */}
          <div className="flex-1 rotate-1 self-center rounded-2xl border bg-white p-4 shadow-lg max-md:w-full">
            <div className="grid grid-cols-2 text-left">
              <div className="flex items-center gap-2 border-b pb-2 text-sm font-medium text-gray-600">
                <AlignLeftIcon className="size-4" />
                Name
              </div>
              <div className="flex items-center gap-2 border-b pb-2 text-sm font-medium text-gray-600">
                <CircleDotIcon className="size-4" />
                Location
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                Michael Chen
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                40.7829,-73.9654
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                Sarah Rodriguez
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                40.7484,-73.9857
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                Aisha Patel
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                40.7527,-73.9772
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                Marcus Thompson
              </div>
              <div className="border-b py-2 text-sm text-gray-600">
                40.7589,-73.9851
              </div>
              <div className="pt-2 text-sm text-gray-600">Elena Kowalski</div>
              <div className="pt-2 text-sm text-gray-600">40.7614,-73.9776</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
