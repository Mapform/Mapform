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
import { WorkspaceWithOrg, createForm } from "./actions";

interface OrganizationProps {
  workspaceWithOrg: WorkspaceWithOrg;
}

export function Create({ workspaceWithOrg }: OrganizationProps) {
  const createWorkspaceWithName = createForm.bind(
    null,
    workspaceWithOrg.slug,
    workspaceWithOrg?.organization.slug
  );

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
