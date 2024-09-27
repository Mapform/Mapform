import { cn } from "@mapform/lib/classnames";
import { Spinner } from "@mapform/ui/components/spinner";
import type { LucideIcon } from "lucide-react";
import React, { forwardRef } from "react";

interface PagePickerButtonProps {
  Icon: LucideIcon;
  children: React.ReactNode;
  isActive?: boolean;
  isSubtle?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

export const PageBarButton = forwardRef<
  HTMLButtonElement,
  PagePickerButtonProps
>(
  (
    {
      Icon,
      children,
      isActive = false,
      isSubtle = false,
      isLoading = false,
      isDisabled = false,
      onClick,
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "flex flex-col flex-1 gap-1 truncate text-center group hover:text-primary font-medium",
          {
            "text-muted-foreground font-normal": !isActive && isSubtle,
          }
        )}
        disabled={isDisabled}
        onClick={onClick}
        ref={ref}
        type="button"
      >
        {isLoading ? (
          <div className="flex h-6 w-6 justify-center items-center mx-auto">
            <Spinner variant="dark" />
          </div>
        ) : (
          <Icon
            className="h-6 w-6 flex-shrink-0 mx-auto"
            strokeWidth={isActive ? 2.2 : 2}
          />
        )}
        <span
          className={cn(
            "truncate text-xs px-1.5 py-0.5 rounded-md group-hover:bg-muted transition max-w-24",
            {
              "!bg-primary text-white": isActive,
            }
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);

PageBarButton.displayName = "PageBarButton";
