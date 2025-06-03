import { usePathname, useRouter } from "next/navigation";
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

      const currentVal = current.get(key);

      // Clear the param if value is not provided
      if (!value && currentVal) {
        current.delete(key);
      } else if (value) {
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
