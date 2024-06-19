"use client";

import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { useCallback, useEffect } from "react";

interface AutoSizeTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}

export function AutoSizeTextArea({
  value,
  onChange,
  onEnter,
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
  }, [updateHeight, bounds]);

  return (
    <textarea
      className="border-0 text-2xl font-bold w-full mb-2 p-0 outline-none border-transparent focus:border-transparent focus:ring-0 placeholder-gray-300 resize-none"
      onChange={(e) => {
        onChange(e.target.value);
        updateHeight();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter();
        }
      }}
      placeholder="Untitled"
      ref={ref}
      // rows={1}
      value={value}
    />
  );
}
