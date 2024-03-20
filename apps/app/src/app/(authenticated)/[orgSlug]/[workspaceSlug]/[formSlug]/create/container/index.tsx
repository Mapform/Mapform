"use client";

import { MapForm } from "@mapform/mapform";
import { Button } from "@mapform/ui/components/button";
import { useSearchParams } from "next/navigation";
import { env } from "~/env.mjs";
import type { FormType } from "../actions";
import { createStep } from "../actions";

// TODO. Temporary. Should get initial view state from previous step, or from user location
const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 0,
};

export function Container({ form }: { form: NonNullable<FormType> }) {
  const searchParams = useSearchParams();
  const createStepWithFromId = createStep.bind(null, form.id, initialViewState);
  const s = searchParams.get("s");

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="h-[500px] w-full p-4 bg-slate-100">
          <MapForm mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN} />
        </div>
        <div className="border-t">
          <form action={createStepWithFromId}>
            <input name="type" value="CONTENT" />
            <Button>New step</Button>
          </form>
          {form.steps.map((step, i) => (
            <div className="bg-blue-200" key={step.id}>
              {i + 1}: {step.type}
            </div>
          ))}
        </div>
      </div>
      {/* SIDE BAR */}
      <div className="w-[400px] border-l">Side</div>
    </div>
  );
}
