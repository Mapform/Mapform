import type { InferUITool, UIMessage } from "ai";
import type { returnBestResults } from "~/lib/ai/tools/return-best-results";
import type { findExternalFeatures } from "~/lib/ai/tools/find-external-features";
import type { findInternalFeatures } from "~/lib/ai/tools/find-internal-features";
import type { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import type { webSearch } from "~/lib/ai/tools/web-search";
import { z } from "zod";

export const messageMetadataSchema = z.object({});

export type ChatTools = {
  findExternalFeatures: InferUITool<typeof findExternalFeatures>;
  reverseGeocode: InferUITool<typeof reverseGeocode>;
  findInternalFeatures: InferUITool<typeof findInternalFeatures>;
  returnBestResults: InferUITool<typeof returnBestResults>;
  webSearch: InferUITool<typeof webSearch>;
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
  address?: string;
  wikidataId?: string;
  coordinates: [number, number];
  source: "stadia" | "mapform";
};
