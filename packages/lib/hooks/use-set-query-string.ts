import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useSetQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    ({
      key,
      value,
      replace = false,
    }: {
      key: string;
      value: string | null;
      replace?: boolean;
    }) => {
      const current = new URLSearchParams(window.location.search);

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
    },
    [pathname, router],
  );
};
