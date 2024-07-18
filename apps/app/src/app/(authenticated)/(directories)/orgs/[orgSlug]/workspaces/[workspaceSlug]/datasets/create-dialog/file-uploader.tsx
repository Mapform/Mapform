"use client";

import { type FormEvent, useState } from "react";
import { parse } from "papaparse";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@mapform/ui/components/input";
import { toast } from "@mapform/ui/components/toaster";
import { Button } from "@mapform/ui/components/button";
import { createDataset } from "~/server/actions/datasets/create";

export function FileUploader({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const { execute, status } = useAction(createDataset, {
    onSuccess: () => {
      toast("Dataset created!");
    },
    onError: () => {
      toast("There was an error creating the dataset.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    execute({
      data,
      name: "My Dataset",
      workspaceId,
    });
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast("There was an error uploading the file.");
      return;
    }
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        console.log(results);
        setData(results.data);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        accept=".csv"
        className="bg-white"
        name="file"
        onChange={changeHandler}
        type="file"
      />
      <Button type="submit">Upload</Button>
    </form>
  );
}
