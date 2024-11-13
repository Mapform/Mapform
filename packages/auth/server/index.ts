import { cookies } from "next/headers";
// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import {
  validateSessionToken,
  type SessionValidationResult,
} from "../helpers/sessions";

// This function can be used in server components, server actions, and route handlers (but importantly not middleware).œ
export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

// EXAMPLE USAGE
// Use within
// // app/api/page.tsx
// import { redirect } from "next/navigation";

// async function Page() {
// 	const { user } = await getCurrentSession();
// 	if (user === null) {
// 		return redirect("/login");
// 	}

// 	async function action() {
// 		"use server";
// 		const { user } = await getCurrentSession();
// 		if (user === null) {
// 			return redirect("/login");
// 		}
// 		// ...
// 	}
// 	// ...
// }
