"use client";

import { useState } from "react";
import { cn } from "@mapform/lib/classnames";
import { ClipboardCopyIcon, ClipboardCheckIcon } from "lucide-react";
import { Button, type ButtonProps } from "./button";

export function Clipboard({
  clipboardText,
  className,
  copyText,
  copiedText,
  variant,
  size,
}: Pick<ButtonProps, "variant" | "size"> & {
  clipboardText: string;
  copyText: string;
  copiedText: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button
      className={cn("gap-1", className)}
      onClick={async (e) => {
        e.preventDefault();
        await copyToClipboard();
      }}
      size={size}
      variant={variant}
    >
      {copied ? (
        <ClipboardCheckIcon className="animate-fade-in h-4 w-4" />
      ) : (
        <ClipboardCopyIcon className="animate-fade-in h-4 w-4" />
      )}
      {copied ? copiedText : copyText}
    </Button>
  );
}
