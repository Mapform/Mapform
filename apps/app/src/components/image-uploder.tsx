"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageUpIcon, Loader2Icon } from "lucide-react";
import { PopoverContent } from "@mapform/ui/components/popover";
import { uploadImageAction } from "~/data/images/upload-image";
import { useAction } from "next-safe-action/hooks";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { toast } from "@mapform/ui/components/toaster";
import { cn } from "@mapform/lib/classnames";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from "@mapform/backend/data/images/upload-image/schema";
import type { FileRejection } from "react-dropzone";

interface ImageUploaderContentProps {
  projectId?: string;
  rowId?: string;
  order?: number;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

export function ImageUploaderContent({
  projectId,
  rowId,
  onUploadSuccess,
  onUploadError,
}: ImageUploaderContentProps) {
  const { workspaceDirectory } = useWorkspace();

  const { execute, isExecuting } = useAction(uploadImageAction, {
    onSuccess: () => {
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });
      onUploadSuccess?.();
    },
    onError: ({ error }) => {
      toast({
        title: "Upload failed",
        description:
          error.serverError ?? "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      onUploadError?.(
        error.serverError ?? "Failed to upload image. Please try again.",
      );
    },
  });

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 2MB.";
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.";
    }

    return null;
  };

  const handleUpload = useCallback(
    (file: File) => {
      execute({
        workspaceId: workspaceDirectory.id,
        image: file,
        projectId,
        rowId,
      });
    },
    [execute, workspaceDirectory.id, projectId, rowId],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length === 0) {
        if (fileRejections.length > 0) {
          const messages = new Set<string>();
          for (const rejection of fileRejections) {
            for (const error of rejection.errors) {
              switch (error.code) {
                case "file-too-large":
                  messages.add("File size must be less than 2MB.");
                  break;
                case "file-invalid-type":
                  messages.add(
                    "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.",
                  );
                  break;
                case "too-many-files":
                  messages.add("Only one file may be uploaded at a time.");
                  break;
                default:
                  if (error.message) messages.add(error.message);
              }
            }
          }
          toast({
            title: "No valid file selected",
            description: Array.from(messages).join(" "),
            variant: "destructive",
          });
        }
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file first (extra safety)
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "Invalid file",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      // Upload immediately
      handleUpload(file);
    },
    [handleUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <PopoverContent className="flex h-40 w-96 flex-col items-center justify-center p-2">
      {isExecuting ? (
        <div className="flex size-full flex-col items-center justify-center">
          <Loader2Icon className="size-4 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm">
            Uploading image...
          </p>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "size-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
          )}
        >
          <input {...getInputProps({ multiple: false })} />
          <ImageUpIcon className="text-muted-foreground mx-auto size-6" />
          <p className="mt-2 text-sm">
            {isDragActive ? (
              "Drop your image here"
            ) : (
              <>
                Drag and drop an image here, or{" "}
                <span className="underline">browse</span>
              </>
            )}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            JPG, PNG, WebP, GIF up to 2MB
          </p>
        </div>
      )}
    </PopoverContent>
  );
}

export {
  Popover as ImageUploaderPopover,
  PopoverTrigger as ImageUploaderTrigger,
  PopoverAnchor as ImageUploaderAnchor,
} from "@mapform/ui/components/popover";
