"use client";

import { cn } from "@mapform/lib/classnames";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { useCallback, useEffect } from "react";

interface AutoSizeTextAreaProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function AutoSizeTextArea({
  value,
  onChange,
  onEnter,
  className,
  placeholder = "Untitled",
  autoFocus = false,
}: AutoSizeTextAreaProps) {
  const { ref, bounds } = useMeasure<HTMLTextAreaElement>();

  const updateHeight = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = "0px";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [ref]);

  useEffect(() => {
    updateHeight();
  }, [updateHeight, bounds, value]);

  return (
    <textarea
      className={cn(
        className,
        "w-full resize-none border-0 border-transparent bg-transparent p-0 outline-none focus:border-transparent focus:ring-0",
      )}
      onChange={(e) => {
        onChange(e.target.value);
        updateHeight();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter?.();
        }
      }}
      placeholder={placeholder}
      ref={ref}
      // rows={1}
      value={value}
      autoFocus={autoFocus}
    />
  );
}
