"use client";

import { TriangleAlert } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
} from "@mapform/ui/components/alert";
import { useIsMobile } from "@mapform/lib/hooks/use-is-mobile";

export function MobileWarning() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-screen-sm">
        <Alert variant="warning">
          <AlertIcon icon={TriangleAlert} />
          <AlertDescription>
            MapForm isn’t optimized for small screens yet. Please use a larger
            display.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
