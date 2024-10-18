import * as React from "react";
import { cn } from "@mapform/lib/classnames";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border text-sm shadow-sm transition-colors file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        filled: "border-0 bg-stone-100",
      },
      s: {
        default: "h-9 px-3 py-1",
        sm: "h-7 px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      s: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, s, type, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, s, className }))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
