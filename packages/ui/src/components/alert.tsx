import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@mapform/lib/classnames";

const alertVariants = cva("rounded-md p-4 flex text-sm", {
  variants: {
    variant: {
      default: "bg-muted text-foreground",
      warning: "bg-yellow-50 text-yellow-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    className={cn(alertVariants({ variant }), className)}
    ref={ref}
    role="alert"
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertIcon = React.forwardRef<
  SVGSVGElement,
  React.HTMLAttributes<SVGSVGElement> &
    VariantProps<typeof alertVariants> & { icon: LucideIcon }
>(({ className, icon, ...props }, ref) => {
  const Icon = icon;

  return (
    <Icon
      aria-hidden="true"
      className={cn("size-5 flex-shrink-0 text-inherit", className)}
      ref={ref}
      {...props}
    />
  );
});
AlertIcon.displayName = "AlertIcon";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof alertVariants>
>(({ className, ...props }, ref) => (
  <p
    className={cn("my-0 ml-3 text-sm font-medium text-inherit", className)}
    ref={ref}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertIcon, AlertDescription };
