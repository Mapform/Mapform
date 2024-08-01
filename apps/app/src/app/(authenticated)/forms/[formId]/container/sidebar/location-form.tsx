"use client";

import { Input } from "@mapform/ui/components/input";
import {
  useForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  zodResolver,
} from "@mapform/ui/components/form";
import { toast } from "@mapform/ui/components/toaster";
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { type ViewState } from "@mapform/mapform";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  type UpdateStepLocationSchema,
  updateStepLocationSchema,
} from "~/data/steps/update-location/schema";
import { updateStepWithLocation } from "~/data/steps/update-location";

interface LocationFormProps {
  stepId: string;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState>>;
}

export function LocationForm({
  stepId,
  viewState,
  setViewState,
}: LocationFormProps) {
  const form = useForm<UpdateStepLocationSchema>({
    resolver: zodResolver(updateStepLocationSchema),
    defaultValues: {
      stepId,
      data: {
        latitude: viewState.latitude,
        longitude: viewState.longitude,
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing,
      },
    },
  });

  const { execute, status } = useAction(updateStepWithLocation, {
    onSuccess: () => {
      toast("Location updated ✅");
    },
    onError: () => {
      toast("There was an issue updating the location");
    },
  });

  const onSubmit = (data: UpdateStepLocationSchema) => {
    execute({
      stepId,
      data: data.data,
    });
  };

  useEffect(() => {
    // TODO: Debounce
    form.setValue("data", viewState);
  }, [viewState, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <FormField
            control={form.control}
            name="data.latitude"
            render={({ field: { onBlur: _, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...rest}
                    onBlur={(e) => {
                      setViewState((prev) => ({
                        ...prev,
                        latitude: Number(e.target.value),
                      }));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.longitude"
            render={({ field: { onBlur: _, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...rest}
                    onBlur={(e) => {
                      setViewState((prev) => ({
                        ...prev,
                        longitude: Number(e.target.value),
                      }));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.zoom"
            render={({ field: { onBlur: _, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Zoom</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...rest}
                    onBlur={(e) => {
                      setViewState((prev) => ({
                        ...prev,
                        zoom: Number(e.target.value),
                      }));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.pitch"
            render={({ field: { onBlur: _, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Pitch</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...rest}
                    onBlur={(e) => {
                      setViewState((prev) => ({
                        ...prev,
                        pitch: Number(e.target.value),
                      }));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.bearing"
            render={({ field: { onBlur: _, ...rest } }) => (
              <FormItem className="flex-1">
                <FormLabel>Bearing</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...rest}
                    onBlur={(e) => {
                      setViewState((prev) => ({
                        ...prev,
                        bearing: Number(e.target.value),
                      }));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={status === "executing"}
          size="sm"
          type="submit"
          variant="secondary"
        >
          {status === "executing" ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
