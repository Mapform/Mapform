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

export default function Create() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create a new thing</DialogDescription>
        </DialogHeader>
        <form>
          <Label htmlFor="create-input">Name</Label>
          <Input type="text" placeholder="Name" id="create-input" />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
