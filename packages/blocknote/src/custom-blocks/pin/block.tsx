/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  useFormContext,
  FormLabel,
} from "@mapform/ui/components/form";
// import { useState } from "react";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { AsteriskIcon } from "lucide-react";
import { useCustomBlockContext } from "../../context";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";

export const Pin = createReactBlockSpec(
  {
    type: "pin",
    propSchema: {
      label: {
        default: "",
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
      const { editable, pinBlock } = useCustomBlockContext();
      // const [prevViewState, setPrevViewState] = useState(viewState);

      if (editable) {
        return (
          <div className="mb-4 flex w-full flex-col gap-2">
            <div className="flex flex-1 justify-between">
              <AutoSizeTextArea
                className="p-0 text-base font-medium placeholder-gray-300"
                value={block.props.label}
                onChange={(label) =>
                  editor.updateBlock(block, {
                    type: "pin",
                    props: { label },
                  })
                }
              />
              {block.props.required ? (
                <AsteriskIcon height={14} width={14} />
              ) : null}
            </div>
            <Button
              className="relative w-full cursor-default"
              variant="secondary"
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
            </Button>
          </div>
        );
      }

      const currentLatitude = form.watch(`${block.id}.latitude`);
      const currentLongitude = form.watch(`${block.id}.longitude`);

      return (
        <div className="fiex mb-4 w-full flex-col space-y-2">
          <FormLabel className="flex justify-between text-base font-medium">
            {block.props.label}
            {block.props.required ? (
              <AsteriskIcon height={14} width={14} />
            ) : null}
          </FormLabel>
          <Button
            className="relative w-full"
            onClick={() => {
              pinBlock?.setIsSelectingLocation(true);

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
            // size="sm"
            type="button"
            variant="secondary"
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

          <FormField
            control={form.control}
            // disabled
            // This is what allows us to match the user value back to the input
            name={`${block.id}.y`}
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
            name={`${block.id}.x`}
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
