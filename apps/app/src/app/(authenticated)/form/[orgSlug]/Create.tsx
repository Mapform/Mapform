"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import { Button } from "@mapform/ui/components/button";
import { Label } from "@mapform/ui/components/label";
import { Input } from "@mapform/ui/components/input";
import { createWorkspace } from "./actions";

interface OrganizationProps {
  organizationId: string;
}

export default function Create({ organizationId }: OrganizationProps) {
  const createWorkspaceWithName = createWorkspace.bind(null, organizationId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create a workspace</DialogDescription>
        </DialogHeader>
        <form action={createWorkspaceWithName}>
          <Label htmlFor="create-input">Name</Label>
          <Input type="text" placeholder="Name" name="name" id="create-input" />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
