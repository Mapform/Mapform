import { redirect } from "next/navigation";

// This will eventually be the landing page. Redirect for now.
export default function Page() {
  return redirect("/app");
}
