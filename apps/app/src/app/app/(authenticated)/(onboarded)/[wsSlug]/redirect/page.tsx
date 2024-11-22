import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams?: Promise<{
    url?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  if (!searchParams?.url) {
    return;
  }

  redirect(searchParams.url);
}

export function generateMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}
