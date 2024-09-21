"use client";

import type { z } from "zod";
import {
  CustomBlockContext,
  getFormSchemaFromBlockNote,
} from "@mapform/blocknote";
import { cn } from "@mapform/lib/classnames";
import type { Page } from "@mapform/db/schema";
import { Button } from "@mapform/ui/components/button";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import type { CustomBlock } from "@mapform/blocknote";
import { ChevronLeftIcon } from "lucide-react";
import { useMapForm } from "../context";
import { Blocknote } from "./blocknote";

interface MapFormContentProps {
  title: Page["title"];
  content: Page["content"];
  defaultFormValues?: Record<string, string>;
  onImageUpload?: (file: File) => Promise<string | null>;
  onTitleChange?: (content: string) => void;
  onContentChange?: (content: { content: CustomBlock[] }) => void;
}

export function MapFormContent({
  content,
  title,
  defaultFormValues,
  onImageUpload,
  onTitleChange,
  onContentChange,
}: MapFormContentProps) {
  const {
    isProduction,
    currentPage,
    isSelectingPinLocationFor,
    setIsSelectingPinLocationFor,
  } = useMapForm();

  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    content?.content || []
  );

  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });

  const onPageSubmit = () => {
    console.log("Submit");
  };

  if (!currentPage) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onPageSubmit)}>
        <CustomBlockContext.Provider
          value={{
            isProduction,
            onImageUpload,
            isSelectingPinLocationFor,
            setIsSelectingPinLocationFor,
          }}
        >
          {/* CONTENT */}
          <div
            className={cn(
              "group absolute bg-background z-10 w-[360px]",
              currentPage.contentViewType === "text"
                ? "h-full w-full p-2 pb-0 z-10"
                : currentPage.contentViewType === "split"
                  ? "h-full p-2 pb-0 m-0"
                  : "h-initial rounded-lg shadow-lg p-0 m-2"
            )}
          >
            <div
              className={cn("h-full", {
                // "pl-9": editable,
                "px-9": !isProduction && currentPage.contentViewType === "text",
                "pl-9": !isProduction && currentPage.contentViewType !== "text",
              })}
            >
              <Blocknote
                contentViewType={currentPage.contentViewType}
                description={content ?? undefined}
                // Need key to force re-render, otherwise Blocknote state doesn't
                // change when changing steps
                isProduction={isProduction}
                key={currentPage.id}
                onContentChange={onContentChange}
                // onPrev={onPrev}
                onTitleChange={onTitleChange}
                title={title}
              >
                <div className="mt-auto flex justify-between p-4 pt-0">
                  <div className="gap-2">
                    <Button
                      disabled={!isProduction}
                      // onClick={onPrev}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <ChevronLeftIcon />
                    </Button>
                  </div>
                  <Button disabled={!isProduction} type="submit">
                    Next
                  </Button>
                </div>
              </Blocknote>
            </div>
          </div>
        </CustomBlockContext.Provider>
      </form>
    </Form>
  );
}
