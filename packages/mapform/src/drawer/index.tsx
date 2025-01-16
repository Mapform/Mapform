import { useWindowSize } from "@mapform/lib/hooks/use-window-size";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";
import { DesktopDrawer } from "./desktop-drawer";
import { MobileDrawer } from "./mobile-drawer";

interface DrawerProps {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Drawer({ open, children, className, onClose }: DrawerProps) {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 768;

  const content = (
    <>
      {onClose ? (
        <Button
          className="absolute right-2 top-2"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <XIcon className="size-5" />
        </Button>
      ) : null}
      {children}
    </>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} className={className}>
        {content}
      </MobileDrawer>
    );
  }

  return (
    <DesktopDrawer open={open} className={className}>
      {content}
    </DesktopDrawer>
  );
}
