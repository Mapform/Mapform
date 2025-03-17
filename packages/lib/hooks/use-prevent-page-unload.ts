import { useEffect } from "react";

export const usePreventPageUnload = (isLoading: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log("isLoading", isLoading);
      if (isLoading) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);
};
