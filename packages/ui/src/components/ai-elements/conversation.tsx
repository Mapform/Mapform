"use client";

import { Button } from "../button";
import { cn } from "@mapform/lib/classnames";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
> & { mobileAutoScrollKey?: number | string };

function ConversationMobileScrollBinder() {
  const { scrollRef } = useStickToBottomContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    const container = document.querySelector<HTMLElement>(
      "[data-map-scroll-container]",
    );
    if (!container) return;

    (scrollRef as unknown as (instance: HTMLElement | null) => void)(container);

    return () => {
      (scrollRef as unknown as (instance: HTMLElement | null) => void)(null);
    };
  }, [isMobile, scrollRef]);

  return null;
}

export const ConversationContent = ({
  className,
  children,
  mobileAutoScrollKey,
  ...props
}: ConversationContentProps) => {
  const { scrollToBottom } = useStickToBottomContext();
  const isMobile = useIsMobile();
  const hasRunInitialRef = useRef(false);

  /**
   * Added to get scrolling to work on mobile
   */
  useEffect(() => {
    if (!isMobile) return;
    const id = requestAnimationFrame(() => {
      void scrollToBottom();
    });
    let timeoutId: number | undefined;
    if (!hasRunInitialRef.current) {
      hasRunInitialRef.current = true;
      timeoutId = window.setTimeout(() => {
        void scrollToBottom();
      }, 180);
    }
    return () => {
      cancelAnimationFrame(id);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [mobileAutoScrollKey, isMobile, scrollToBottom]);

  return (
    <StickToBottom.Content className={cn("p-4", className)} {...props}>
      {(context) => (
        <>
          <ConversationMobileScrollBinder />
          {typeof children === "function"
            ? (children as (ctx: unknown) => React.ReactNode)(context)
            : children}
        </>
      )}
    </StickToBottom.Content>
  );
};

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    void scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
          className,
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
