import type { InferUITool, UIMessage, UITool } from "ai";
import type { returnBestResults } from "~/lib/ai/tools/return-best-results";
import type { autocomplete } from "~/lib/ai/tools/autocomplete";
import type { getInformation } from "~/lib/ai/tools/get-information";
import type { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import { z } from "zod";

export const messageMetadataSchema = z.object({});

export type ChatTools = {
  autocomplete: InferUITool<typeof autocomplete>;
  reverseGeocode: InferUITool<typeof reverseGeocode>;
  getInformation: InferUITool<typeof getInformation>;
  returnBestResults: InferUITool<typeof returnBestResults>;
  web_search_preview: UITool;
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

export type AIResultLocation = {
  id: string;
  name?: string;
  description?: string;
  wikidata?: string;
  coordinates: [number, number];
};
