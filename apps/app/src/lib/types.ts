import type { InferUITool, UIMessage } from "ai";
import type { returnBestResults } from "~/lib/ai/tools/return-best-results";
import type { findRawExternalFeatures } from "~/lib/ai/tools/find-external-features";
import type { findRawInternalFeatures } from "~/lib/ai/tools/find-internal-features";
import type { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import type { webSearch } from "~/lib/ai/tools/web-search";
import { z } from "zod";

export const messageMetadataSchema = z.object({});

export type ChatTools = {
  findRawExternalFeatures: InferUITool<typeof findRawExternalFeatures>;
  reverseGeocode: InferUITool<typeof reverseGeocode>;
  findRawInternalFeatures: InferUITool<typeof findRawInternalFeatures>;
  returnBestResults: InferUITool<typeof returnBestResults>;
  webSearch: InferUITool<typeof webSearch>;
};

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type CustomUIDataTypes = {
  "ai-token-usage": {
    tokens: number;
  };
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

interface StadiaAIResultLocation {
  id: string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  wikidataId?: string;
  source: "stadia";
}

interface MapformAIResultLocation {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  source: "mapform";
}

export type AIResultLocation = StadiaAIResultLocation | MapformAIResultLocation;
