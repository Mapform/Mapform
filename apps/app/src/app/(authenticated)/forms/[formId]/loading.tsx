"use client";

import { Spinner } from "@mapform/ui/components/spinner";

export default function Loading() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <Spinner variant="dark" />
    </div>
  );
}
