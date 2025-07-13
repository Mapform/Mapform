"use client";

import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import { useDropzone } from "react-dropzone";
import { parse } from "@loaders.gl/core";
import { KMLLoader } from "@loaders.gl/kml";
import { JSONLoader } from "@loaders.gl/json";
import { useState } from "react";
import { cn } from "@mapform/lib/classnames";
import { UploadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createRowsAction } from "~/data/rows/create-rows";
import type { Feature, FeatureCollection } from "geojson";
import { toast } from "@mapform/ui/components/toaster";
import { useProject } from "../context";

interface ParsedData {
  [key: string]: any;
  geom?: string;
}

async function parseUploadedFile(file: File): Promise<ParsedData[]> {
  const isKml = file.name.endsWith(".kml");
  const isGeoJson =
    file.name.endsWith(".geojson") || file.name.endsWith(".json");

  if (isKml) {
    const kmlData = (await parse(file.text(), KMLLoader)) as FeatureCollection;
    return kmlData.features.map((f: Feature) => ({
      ...f.properties,
      geom: JSON.stringify(f.geometry),
    }));
  } else if (isGeoJson) {
    const geojson = (await parse(file, JSONLoader)) as FeatureCollection;
    // Convert each GeoJSON feature to a flat row with geometry
    return geojson.features.map((f: Feature) => ({
      ...f.properties,
      geom: JSON.stringify(f.geometry), // Store geometry separately
    }));
  } else {
    throw new Error("Unsupported file type");
  }
}

export function Import() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData[] | null>(null);
  const { projectService } = useProject();

  const { execute, isPending } = useAction(createRowsAction, {
    onSuccess: () => {
      toast({
        title: "Rows created successfully",
      });
    },
    onError: ({ error }) => {
      toast({
        title: "Error",
        description: error.serverError ?? "Failed to create rows",
      });
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const file = acceptedFiles[0];

      if (!file) return;

      const data = await parseUploadedFile(file);
      setParsedData(data);

      execute({
        projectId: projectService.optimisticState.id,
        rows: data.map((d) => ({
          name: "test",
          geometry: d.geom,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.google-earth.kml+xml": [".kml"],
      "application/json": [".geojson", ".json"],
    },
    maxFiles: 1,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              isLoading && "cursor-not-allowed opacity-50",
            )}
          >
            <input {...getInputProps()} disabled={isLoading} />
            <UploadIcon className="text-muted-foreground mx-auto size-6" />
            <p className="text-muted-foreground mt-2 text-sm">
              {isDragActive
                ? "Drop your file here"
                : "Drag files here, or click to select"}
            </p>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              .kml, .geojson, .json
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive mt-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {parsedData && (
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">
                Successfully parsed {parsedData.length} records
              </p>
              {/* Add preview or additional actions here */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
