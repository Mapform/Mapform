"use client";

import Link from "next/link";
import { Button } from "@mapform/ui/components/button";
import { useAuth } from "~/app/root-providers";

export function SignIn() {
  const { user } = useAuth();

  if (user) {
    return (
      <Link href="/app">
        <Button variant="secondary">Open app</Button>
      </Link>
    );
  }

  return (
    <Link href="/app/signin">
      <Button variant="secondary">Sign in</Button>
    </Link>
  );
}
