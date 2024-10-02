/* eslint-disable import/no-named-as-default-member -- It's cool yo */
import {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import mapboxgl from "mapbox-gl";
import { cn } from "@mapform/lib/classnames";
import type { FeatureCollection } from "geojson";
import type { PageData, ViewState } from "@mapform/map-utils/types";
import ReactDOM from "react-dom";
import type { CustomBlock } from "@mapform/blocknote";
import { CheckIcon, ChevronRightIcon, TriangleIcon } from "lucide-react";
import { useMeasure } from "@mapform/lib/hooks/use-measure";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export type MBMap = mapboxgl.Map;

interface MapProviderContextProps {
  map?: MBMap;
  setMap: Dispatch<SetStateAction<MBMap | undefined>>;
}

export const MapProviderContext = createContext<MapProviderContextProps>(
  {} as MapProviderContextProps
);
export const useMap = () => useContext(MapProviderContext);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<MBMap>();

  return (
    <MapProviderContext.Provider
      value={{
        map,
        setMap,
      }}
    >
      {children}
    </MapProviderContext.Provider>
  );
}

interface MapProps {
  pageData?: PageData;
  editable?: boolean;
  onLoad?: () => void;
  initialViewState: ViewState;
  searchLocationMarker?: {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    description?: {
      content: CustomBlock[];
    };
  } | null;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const CustomMarker = ({ title }: { title: string }) => {
  const { ref, bounds } = useMeasure<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  return (
    <div
      className="bg-white p-4 rounded-md shadow-md w-[240px] relative"
      style={{
        transform: `translateY(-${bounds.height / 2 + 16 + 8}px)`,
      }}
      ref={ref}
    >
      <div className="flex flex-col">
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="mt-8 flex">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className="ml-auto"
                role="combobox"
                size="sm"
                aria-expanded={open}
              >
                Add to
                <ChevronRightIcon className="ml-2 -mr-1 size-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="right"
              className="w-[200px] p-0"
            >
              <Command>
                <CommandInput
                  placeholder="Search layers..."
                  value={query}
                  onValueChange={(value: string) => setQuery(value)}
                />
                <CommandList>
                  <CommandEmpty
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 m-1"
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <p>Create: </p>
                    <p className="block max-w-48 truncate font-semibold text-primary ml-1">
                      {query}
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {query.length ? (
                      <CommandItem
                        onClick={() => {
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <p>Create: </p>
                        <p className="block max-w-48 truncate font-semibold text-primary ml-1">
                          {query}
                        </p>
                      </CommandItem>
                    ) : null}
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={() => {
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Caret */}
      <TriangleIcon
        className="absolute text-white rotate-180 -translate-x-1/2 left-1/2 -bottom-4 size-5"
        fill="white"
      />
    </div>
  );
};

/**
 * TODO:
 * 1. Add ability to add markers
 * 2. Style points a bit better
 * 3. Add zIndex to points according to layer order
 */
export function Map({
  initialViewState,
  editable = false,
  pageData,
  onLoad,
  searchLocationMarker,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMap();
  const markerEl = useRef<mapboxgl.Marker | null>(null);
  const markerElInner = useRef<HTMLDivElement>(document.createElement("div"));

  const geojson: FeatureCollection = useMemo(
    () => ({
      type: "FeatureCollection",
      features: (pageData?.pointData ?? []).map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.value.x, point.value.y],
        },
        properties: {
          id: point.id,
        },
      })),
    }),
    [pageData]
  );

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    /**
     * Configure the map object and set it in context
     */
    if (mapContainer.current) {
      // Create map with initial state
      const m = new mapboxgl.Map({
        container: mapContainer.current,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: initialViewState.pitch,
        bearing: initialViewState.bearing,
        maxZoom: 20,
        logoPosition: "bottom-right",
        fitBoundsOptions: {
          padding: { top: 10, bottom: 25, left: 800, right: 5 },
        },
      });

      m.setPadding({
        top: 0,
        bottom: 0,
        left: 360,
        right: 0,
      });

      // Add zoom controls
      m.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add your custom markers and lines here
      m.on("load", () => {
        setMap(m);
        onLoad && onLoad();
      });

      // Clean up on unmount
      return () => {
        m.remove();
        setMap(undefined);
      };
    }
  }, []);

  /**
   * Update layers
   */
  useEffect(() => {
    if (map) {
      const currentSource = map.getSource("points") as
        | mapboxgl.AnySourceImpl
        | undefined;

      if (currentSource) {
        // Update the source data
        (currentSource as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        // Add a new source and layer
        map.addSource("points", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "points",
          type: "circle",
          source: "points",
          paint: {
            "circle-radius": 10,
            "circle-color": "#007cbf",
          },
        });
      }
    }
  }, [map, geojson]);

  /**
   * Update searchLocationMarker marker
   */
  useEffect(() => {
    const currentLngLat = markerEl.current?.getLngLat();
    if (
      map &&
      searchLocationMarker &&
      currentLngLat?.lat !== searchLocationMarker.latitude &&
      currentLngLat?.lng !== searchLocationMarker.longitude
    ) {
      ReactDOM.render(
        <CustomMarker title={searchLocationMarker.name} />,
        markerElInner.current
      );
      markerEl.current?.remove();
      markerEl.current = new mapboxgl.Marker(markerElInner.current)
        .setLngLat([
          searchLocationMarker.longitude,
          searchLocationMarker.latitude,
        ])
        .addTo(map);
    }

    if (map && !searchLocationMarker) {
      markerEl.current?.remove();
    }
  }, [map, searchLocationMarker]);

  return (
    <div
      className={cn("flex-1", {
        "rounded-md": editable,
      })}
      ref={mapContainer}
    />
  );
}
