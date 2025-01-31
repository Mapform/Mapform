/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  useFormContext,
} from "@mapform/ui/components/form";
// import { useState } from "react";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { AsteriskIcon } from "lucide-react";
import { useCustomBlockContext } from "../../context";

export const Pin = createReactBlockSpec(
  {
    type: "pin",
    propSchema: {
      label: {
        default: "My Label",
        type: "string",
      },
      text: {
        default: "Pick a Location",
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
        isSelectingPinLocationFor,
        setIsSelectingPinLocationFor,
      } = useCustomBlockContext();
      // const [prevViewState, setPrevViewState] = useState(viewState);

      if (editable) {
        return (
          <Button
            className="relative w-full cursor-default"
            size="sm"
            variant="outline"
          >
            <input
              className="w-full border-0 border-transparent bg-transparent p-0 text-center text-sm font-medium outline-none focus:border-transparent focus:ring-0"
              onChange={(e) => {
                editor.updateBlock(block, {
                  type: "pin",
                  props: { text: e.target.value },
                });
              }}
              value={block.props.text}
            />
            {block.props.required ? (
              <AsteriskIcon
                className="absolute right-2"
                height={14}
                width={14}
              />
            ) : null}
          </Button>
        );
      }

      const currentLatitude = form.watch(`${block.id}.latitude`);
      const currentLongitude = form.watch(`${block.id}.longitude`);

      return (
        <div className="fiex w-full flex-col">
          {isSelectingPinLocationFor === block.id ? (
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  // form.setValue(`${block.id}.latitude`, viewState.latitude);
                  // form.setValue(`${block.id}.longitude`, viewState.longitude);
                  // setViewState(prevViewState);
                  if (setIsSelectingPinLocationFor) {
                    setIsSelectingPinLocationFor(null);
                  }
                }}
                size="sm"
              >
                Done
              </Button>
              {currentLatitude && currentLongitude ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    form.setValue(`${block.id}.latitude`, "");
                    form.setValue(`${block.id}.longitude`, "");
                    // setViewState(prevViewState);
                    if (setIsSelectingPinLocationFor) {
                      setIsSelectingPinLocationFor(null);
                    }
                  }}
                  variant="outline"
                >
                  Clear Selection
                </Button>
              ) : null}
              <Button
                className="w-full"
                onClick={() => {
                  // setViewState(prevViewState);
                  if (setIsSelectingPinLocationFor) {
                    setIsSelectingPinLocationFor(null);
                  }
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              className="relative w-full"
              onClick={() => {
                if (setIsSelectingPinLocationFor) {
                  setIsSelectingPinLocationFor(block.id);
                }

                // setPrevViewState(viewState);

                // setViewState({
                //   ...viewState,
                //   zoom: viewState.zoom * 1.2,
                //   latitude: currentLatitude
                //     ? currentLatitude
                //     : viewState.latitude,
                //   longitude: currentLongitude
                //     ? currentLongitude
                //     : viewState.longitude,
                // });
              }}
              size="sm"
              variant="outline"
            >
              {block.props.text}
              {block.props.required ? (
                <AsteriskIcon
                  className="absolute right-2"
                  height={14}
                  width={14}
                />
              ) : null}
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
        </div>
      );
    },
  },
);
