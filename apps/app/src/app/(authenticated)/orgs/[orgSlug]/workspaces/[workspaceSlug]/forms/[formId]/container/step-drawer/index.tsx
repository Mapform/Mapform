import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";

export const StepDrawerRoot = Drawer;
export const StepDrawerTrigger = DrawerTrigger;

export function StepDrawerContent() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
    </DrawerContent>
  );
}
