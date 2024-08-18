"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { buttonVariants } from "./button";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item className={className} ref={ref} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex flex-1 px-4">
    <AccordionPrimitive.Trigger
      className={cn(
        "-mx-3 hover:bg-stone-100 flex-1 pl-2 pr-2 py-1 rounded flex items-center mb-[2px] cursor-pointer gap-1 text-sm text-stone-700 [&[data-state=closed]>span>svg]:-rotate-90 [&[data-state=open]>span>svg]:rotate-0 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {/* <div className="flex rounded items-center justify-center flex-shrink-0 p-1 hover:bg-stone-200">
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div> */}
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "text-muted-foreground hover:bg-stone-200"
        )}
      >
        <ChevronDownIcon className="h-4 w-4 shrink-0 transition-all duration-200" />
      </span>
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    animate?: boolean;
  }
>(({ className, children, animate, ...props }, ref) => (
  <AccordionPrimitive.Content
    className={cn("overflow-hidden text-sm px-4 pb-4 pt-2", {
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down":
        animate,
    })}
    ref={ref}
    {...props}
  >
    <div className={cn(className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionPrimitive,
};
