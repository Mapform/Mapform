import { useEffect } from "react";
import { useParamsContext } from "~/lib/params/client";

interface AutocompleteMessageProps {
  geoapifyPlaceId?: string;
}

export function AutocompleteMessage({
  geoapifyPlaceId,
}: AutocompleteMessageProps) {
  const { setQueryStates } = useParamsContext();
  useEffect(() => {
    if (geoapifyPlaceId) {
      void setQueryStates({
        geoapifyPlaceId,
      });
    }
  }, [geoapifyPlaceId, setQueryStates]);

  return null;
}
