import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";

export type LayerToEdit = NonNullable<
  GetPageWithLayers["data"]
>["layersToPages"][number]["layer"];

export type LayerType = LayerToEdit["type"];
