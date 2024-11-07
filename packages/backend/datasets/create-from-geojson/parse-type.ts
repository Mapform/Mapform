import type { Column } from "@mapform/db/schema";
import { z } from "zod";

export function parseType(val: unknown) {
  // Parse booleans
  if (z.boolean().safeParse(val).success) {
    return {
      type: "bool" as Column["type"],
      value: val as boolean,
    };
  }

  if (z.string().safeParse(val).success) {
    return {
      type: "string" as Column["type"],
      value: val as string,
    };
  }

  if (z.number().safeParse(val).success) {
    return {
      type: "number" as Column["type"],
      value: val as number,
    };
  }

  if (z.date().safeParse(val).success) {
    return {
      type: "date" as Column["type"],
      value: val as Date,
    };
  }

  throw new Error("Could not parse type");
}
