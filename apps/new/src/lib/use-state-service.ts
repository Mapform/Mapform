import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { useOptimisticAction } from "next-safe-action/hooks";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";

export interface StateServiceProps<TState, TAction> {
  execute: (args: TAction) => void;
  optimisticState: TState | undefined;
  isPending: boolean;
  setOptimisticState: (state: TState) => void;
  resetOptimisticState: () => void;
}

interface UseStateServiceOptions<TState, TAction> {
  currentState: TState;
  updateFn: (state: TState, action: TAction) => TState;
  onError?: (error: unknown) => void;
  onSuccess?: (data: unknown) => void;
}

/**
 * Used to handle debounced optimistic actions.
 */
export function useStateService<TState, TAction>(
  action: (...args: any[]) => any,
  options: UseStateServiceOptions<TState, TAction>,
): StateServiceProps<TState, TAction> {
  const { currentState, updateFn, ...restOptions } = options;

  const {
    execute,
    optimisticState: actionOptimisticState,
    isPending: isExecutePending,
  } = useOptimisticAction(action, { currentState, updateFn, ...restOptions });
  const [isPendingDebounced, setIsPendingDebounced] = useState(false);
  const [optimisticState, setOptimisticState] = useState<TState>(
    actionOptimisticState,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedExecute = useCallback(
    (args: TAction) => {
      // Update using the same useOptimisticAction updateFn
      const newState = updateFn(optimisticState, args);

      setIsPendingDebounced(true);
      setOptimisticState(newState);

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
    setOptimisticState(actionOptimisticState);
  }, [actionOptimisticState]);

  // Update optimistic state when new args are available and no longer pending.
  // This is so that if state is updated via an SSR change, the client state is
  // updated.
  useEffect(() => {
    if (!isPending) {
      setOptimisticState(actionOptimisticState);
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
