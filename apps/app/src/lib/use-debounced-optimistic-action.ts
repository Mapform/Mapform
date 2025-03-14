import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { useOptimisticAction } from "next-safe-action/hooks";
import {
  useTransition,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";

// This function takes in useAction arguments as the first and second arguments, and returns { execute, isPending, optimisticState }
export function useDebouncedOptimisticAction<TState, TAction>(
  ...args: Parameters<typeof useOptimisticAction>
) {
  const updateFn = args[1].updateFn;

  const {
    execute,
    optimisticState: actionOptimisticState,
    isPending: isExecutePending,
  } = useOptimisticAction(...args);
  const [_, startTransition] = useTransition();
  const [isPendingDebounced, setIsPendingDebounced] = useState(false);
  const [optimisticState, setOptimisticState] = useState<TState>(
    actionOptimisticState as TState,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedExecute = useCallback(
    (args: TAction) => {
      // Update using the same useOptimisticAction updateFn
      const newState = updateFn(optimisticState, args);

      setIsPendingDebounced(true);
      startTransition(() => {
        setOptimisticState(newState as TState);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        execute(args);
        setIsPendingDebounced(false);
      }, 2000);
    },
    [execute, optimisticState, updateFn],
  );

  const isPending = useMemo(() => {
    return isPendingDebounced || isExecutePending;
  }, [isPendingDebounced, isExecutePending]);

  const resetOptimisticState = useCallback(() => {
    setOptimisticState(actionOptimisticState as TState);
  }, [actionOptimisticState]);

  // Update optimistic state when new args are available and no longer pending.
  // This is so that if state is updated via an SSR change, the client state is
  // updated.
  useEffect(() => {
    if (!isPending) {
      setOptimisticState(actionOptimisticState as TState);
    }
  }, [actionOptimisticState, isPending]);

  usePreventPageUnload(isPending);

  return {
    execute: debouncedExecute,
    optimisticState,
    isPending,
    setOptimisticState,
    resetOptimisticState,
  };
}
