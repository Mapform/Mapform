import { NextResponse } from "next/server";

export function GET() {
  console.log("SIGN IN ROUTE");

  return NextResponse.next();
}
