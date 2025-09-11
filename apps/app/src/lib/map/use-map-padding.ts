import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { DRAWER_WIDTH, SIDEBAR_WIDTH } from "~/constants/sidebars";
import { useParamsContext } from "~/lib/params/client";

export function useMapPadding(forceOpen?: boolean) {
  const { params } = useParamsContext();
  const pathParams = useParams<{
    pId?: string;
  }>();
  const pathname = usePathname();

  const isSettings = pathname.includes("/settings");

  const paddingSegments = useMemo(
    () => [
      SIDEBAR_WIDTH,
      ...(forceOpen ||
      params.chatId ||
      params.search ||
      params.rowId ||
      params.stadiaId ||
      params.latitude ||
      params.longitude ||
      pathParams.pId ||
      isSettings
        ? [DRAWER_WIDTH]
        : []),
    ],
    [
      forceOpen,
      params.chatId,
      params.search,
      params.rowId,
      params.stadiaId,
      params.latitude,
      params.longitude,
      pathParams.pId,
      isSettings,
    ],
  );

  const totalPadding = useMemo(() => {
    return paddingSegments.reduce((acc, curr) => acc + curr, 0);
  }, [paddingSegments]);

  return {
    left: totalPadding,
    right: 0,
    top: 0,
    bottom: 0,
  };
}
