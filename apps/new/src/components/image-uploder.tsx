"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageUpIcon } from "lucide-react";
import { PopoverContent } from "@mapform/ui/components/popover";
import { uploadImageAction } from "~/data/images/upload-image";
import { useAction } from "next-safe-action/hooks";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { toast } from "@mapform/ui/components/toaster";
import { cn } from "@mapform/lib/classnames";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface ImageUploaderContentProps {
  projectId?: string;
  rowId?: string;
  order?: number;
}

export function ImageUploaderContent({
  projectId,
  rowId,
}: ImageUploaderContentProps) {
  const { workspaceDirectory } = useWorkspace();

  const { execute, isExecuting } = useAction(uploadImageAction, {
    onSuccess: () => {
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });
    },
    onError: ({ error }) => {
      toast({
        title: "Upload failed",
        description:
          error.serverError ?? "Failed to upload image. Please try again.",
        variant: "destructive",
      });
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

  const handleUpload = async (file: File) => {
    if (!workspaceDirectory) return;

    execute({
      workspaceId: workspaceDirectory.id,
      image: file,
      projectId,
      rowId,
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file first
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file first
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
    }
  };

  return (
    <PopoverContent className="w-96 p-2">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
        )}
      >
        <input {...getInputProps()} />
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

      {isExecuting && (
        <div className="text-muted-foreground text-center text-sm">
          Uploading image...
        </div>
      )}
    </PopoverContent>
  );
}

export {
  Popover as ImageUploaderPopover,
  PopoverTrigger as ImageUploaderTrigger,
} from "@mapform/ui/components/popover";
