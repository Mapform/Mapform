"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { Button } from "./button";

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
  <AccordionPrimitive.Header className="flex px-4">
    <AccordionPrimitive.Trigger
      className={cn(
        "-mx-3 hover:bg-stone-100 flex-1 pl-2 pr-2 py-1 rounded transition-colors flex items-center mb-[2px] cursor-pointer gap-1 text-sm text-stone-700 [&[data-state=closed]>div]:-rotate-90 [&[data-state=open]>div]:rotate-0",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex rounded items-center justify-center flex-shrink-0 p-1 hover:bg-stone-200">
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </div>
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
    className={cn("overflow-hidden text-sm pl-4", {
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down":
        animate,
    })}
    ref={ref}
    {...props}
  >
    <div className={cn("p-4 pt-2", className)}>{children}</div>
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
