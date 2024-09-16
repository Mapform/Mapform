import { ColumnType } from "@mapform/db";
import { describe, it, expect } from "vitest";
import { parseType } from "./parse-type";
import { prepCell } from "./prep-cell";

describe("parseType", () => {
  it("correctly identifies and returns values and types", () => {
    const date = new Date();

    expect(parseType("Hello")).toEqual({
      type: ColumnType.STRING,
      value: "Hello",
    });
    expect(parseType(123)).toEqual({
      type: ColumnType.INT,
      value: 123,
    });
    expect(parseType(123.123)).toEqual({
      type: ColumnType.FLOAT,
      value: 123.123,
    });
    expect(parseType(date)).toEqual({
      type: ColumnType.DATE,
      value: date,
    });
    expect(parseType(true)).toEqual({
      type: ColumnType.BOOL,
      value: true,
    });
  });

  it("throws an error when the type cannot be parsed", () => {
    expect(() => parseType(undefined)).toThrowError("Could not parse type");
  });
});

describe("prepCell", () => {
  it("generates array", () => {
    // prepCell({
    //   type: "Feature",
    //   properties: {
    //     name: "Hello",
    //     age: 123,
    //     isCool: true,
    //     date: new Date(),
    //   },
    // })
  });
});
