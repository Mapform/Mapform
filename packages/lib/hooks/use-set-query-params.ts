import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useSetQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    params: Record<string, string | null | undefined>,
    { replace = false }: { replace?: boolean } = {}
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const [key, value] of Object.entries(params)) {
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    if (replace) {
      router.replace(`${pathname}${query}`);
    } else {
      router.push(`${pathname}${query}`);
    }
  };
}
