import type { InferUITool, UIMessage } from "ai";
import type { autocomplete } from "~/lib/ai/tools/autocomplete";
import type { getInformation } from "~/lib/ai/tools/get-information";
import type { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import type { searchPlaces } from "~/lib/ai/tools/search-places";
import { z } from "zod";

export const messageMetadataSchema = z.object({});

export type ChatTools = {
  // autocomplete: InferUITool<typeof autocomplete>;
  reverseGeocode: InferUITool<typeof reverseGeocode>;
  searchPlaces: InferUITool<typeof searchPlaces>;
  getInformation: InferUITool<typeof getInformation>;
};

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: null;
  appendMessage: string;
  id: string;
  title: string;
  kind: null;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;
