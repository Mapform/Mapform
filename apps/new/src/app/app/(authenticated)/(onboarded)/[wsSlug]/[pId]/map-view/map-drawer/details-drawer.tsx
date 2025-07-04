import { SmilePlusIcon, XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useProject } from "../../context";
import { DRAWER_WIDTH } from "../constants";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Blocknote } from "@mapform/blocknote/editor";
import { PropertyValueEditor } from "../../properties/property-value-editor";
import { PropertyColumnEditor } from "../../properties/property-column-editor";
import { useParamsContext } from "~/lib/params/client";
import { AnimatePresence, motion } from "motion/react";

export function DetailsDrawer() {
  const { geoapifyPlaceDetails, featureService } = useProject();
  const {
    isPending,
    params: { geoapifyPlaceId },
    setQueryStates,
  } = useParamsContext();

  return (
    <AnimatePresence>
      {geoapifyPlaceId && (
        <motion.div
          // point-events-auto needed to work around Vaul bug: https://github.com/emilkowalski/vaul/pull/576
          className="!pointer-events-auto absolute bottom-2 left-2 top-2 z-20 flex !select-text outline-none"
          style={{
            width: DRAWER_WIDTH - 16,
          }}
          initial={{ x: -DRAWER_WIDTH + 16 }}
          animate={{ x: 0 }}
          exit={{ x: -DRAWER_WIDTH + 16 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white p-6">
            <Button
              className="absolute right-4 top-4"
              size="icon-sm"
              type="button"
              variant="ghost"
              onClick={() => {
                void setQueryStates({ geoapifyPlaceId: null });
              }}
            >
              <XIcon className="size-4" />
            </Button>
            {isPending ? (
              <>
                <Skeleton className="mb-2 size-8 rounded-full" />
                <Skeleton className="h-6" />
              </>
            ) : geoapifyPlaceDetails ? (
              <div className="">
                <h1>Details</h1>
                {geoapifyPlaceDetails.name}
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
                <div className="text-center">
                  <h3 className="text-foreground mt-2 text-sm font-medium">
                    No feature found
                  </h3>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
