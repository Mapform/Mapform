import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useSetQueryParam(
  key: string,
  value: string | null | undefined,
  { replace = false }: { replace?: boolean }
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = new URLSearchParams(Array.from(searchParams.entries()));

  // Clear the param if value is not provided
  if (!value) {
    current.delete(key);
  } else {
    current.set(key, value);
  }

  const search = current.toString();
  const query = search ? `?${search}` : "";

  if (replace) {
    router.replace(`${pathname}${query}`);
  } else {
    router.push(`${pathname}${query}`);
  }
}
