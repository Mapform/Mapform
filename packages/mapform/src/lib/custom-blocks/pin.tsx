import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  useFormContext,
} from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { useMapFormContext } from "../../mapform/context";
import { useState } from "react";

export const Pin = createReactBlockSpec(
  {
    type: "pin",
    propSchema: {
      label: {
        default: "My Label",
        type: "string",
      },
      placeholder: {
        default: "",
        type: "string",
      },
      required: {
        default: false,
        type: "boolean",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const form = useFormContext();
      const {
        editable,
        viewState,
        setViewState,
        isSelectingPinLocationFor,
        setIsSelectingPinLocationFor,
      } = useMapFormContext();
      const [prevViewState, setPrevViewState] = useState(viewState);

      return (
        <>
          {isSelectingPinLocationFor === block.id ? (
            <div className="flex flex-row-reverse gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  form.setValue(`${block.id}.latitude`, viewState.latitude);
                  form.setValue(`${block.id}.longitude`, viewState.longitude);
                  setViewState({
                    viewState: prevViewState,
                  });
                  setIsSelectingPinLocationFor(null);
                }}
              >
                Done
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setViewState({
                    viewState: prevViewState,
                  });
                  setIsSelectingPinLocationFor(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setIsSelectingPinLocationFor(block.id);

                const currentLatitude = form.getValues(`${block.id}.latitude`);
                const currentLongitude = form.getValues(
                  `${block.id}.longitude`
                );

                setPrevViewState(viewState);

                setViewState({
                  viewState: {
                    ...viewState,
                    zoom: viewState.zoom * 1.2,
                    latitude: currentLatitude
                      ? currentLatitude
                      : viewState.latitude,
                    longitude: currentLongitude
                      ? currentLongitude
                      : viewState.longitude,
                  },
                });
              }}
              variant="secondary"
            >
              Pick a Location
            </Button>
          )}
          <FormField
            control={form.control}
            // disabled
            // This is what allows us to match the user value back to the input
            name={`${block.id}.latitude`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="" {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            // disabled
            // This is what allows us to match the user value back to the input
            name={`${block.id}.longitude`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="" {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      );
    },
  }
);
