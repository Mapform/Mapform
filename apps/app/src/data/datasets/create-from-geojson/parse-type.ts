import { ColumnType } from "@mapform/db";
import { z } from "zod";

export function parseType(val: unknown) {
  // Parse booleans
  if (z.boolean().safeParse(val).success) {
    return {
      type: ColumnType.BOOL,
      value: val,
    };
  }

  if (z.string().safeParse(val).success) {
    return {
      type: ColumnType.STRING,
      value: val,
    };
  }

  if (z.number().int().safeParse(val).success) {
    return {
      type: ColumnType.INT,
      value: val,
    };
  }

  if (z.number().safeParse(val).success) {
    return {
      type: ColumnType.FLOAT,
      value: val,
    };
  }

  if (z.date().safeParse(val).success) {
    return {
      type: ColumnType.DATE,
      value: val,
    };
  }

  throw new Error("Could not parse type");
}
