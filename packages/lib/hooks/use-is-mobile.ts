import { useWindowSize } from "./use-window-size";

export function useIsMobile() {
  const { width } = useWindowSize();
  return !!width && width < 768;
}
