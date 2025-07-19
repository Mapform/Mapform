import type { Column } from "@mapform/db/schema";
import type { CustomBlock } from "node_modules/@mapform/blocknote/schema";

interface FeatureProps {
  title: string | null;
  description: string | CustomBlock[] | null;
  icon: string | null;
  images: {
    url: string;
    attribution: string;
  }[];
  properties: {
    id?: string;
    type: Column["type"];
    name: string;
    value: string | number | boolean | null;
  }[];
}

export function Feature({ title, description, icon }: FeatureProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
