import type { InferUITool, UIMessage } from "ai";
import type { autocomplete } from "~/lib/ai/tools/autocomplete";
import type { reverseGeocode } from "~/lib/ai/tools/reverse-geocode";
import { z } from "zod";

export const messageMetadataSchema = z.object({});

export type ChatTools = {
  autocomplete: InferUITool<typeof autocomplete>;
  reverseGeocode: InferUITool<typeof reverseGeocode>;
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
