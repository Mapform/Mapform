import { Button } from "@mapform/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";

interface NewLayerSidebarProps {
  setShowNewLayerSidebar: (show: boolean) => void;
}

export function NewLayerSidebar({
  setShowNewLayerSidebar,
}: NewLayerSidebarProps) {
  return (
    <div className="absolute inset-0 bg-white z-10">
      <div className="p-4 border-b">
        <Button
          onClick={() => {
            setShowNewLayerSidebar(false);
          }}
          size="sm"
          variant="secondary"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>
      <div className="p-4 border-b">Stuff</div>
    </div>
  );
}
