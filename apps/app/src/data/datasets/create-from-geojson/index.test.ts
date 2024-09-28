import { describe, it, expect } from "vitest";
import { parseType } from "./parse-type";

describe("parseType", () => {
  it("correctly identifies and returns values and types", () => {
    const date = new Date();

    expect(parseType("Hello")).toEqual({
      type: "string",
      value: "Hello",
    });
    expect(parseType(123)).toEqual({
      type: "number",
      value: 123,
    });
    expect(parseType(123.123)).toEqual({
      type: "number",
      value: 123.123,
    });
    expect(parseType(date)).toEqual({
      type: "date",
      value: date,
    });
    expect(parseType(true)).toEqual({
      type: "bool",
      value: true,
    });
  });

  it("throws an error when the type cannot be parsed", () => {
    expect(() => parseType(undefined)).toThrowError("Could not parse type");
  });
});
