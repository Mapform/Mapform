import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { embeddings } from "@mapform/db/schema";
import type { GenerateEmbeddingsEvent } from "./schema";
import { inngest } from "../..";

interface EmbeddingChunk {
  rowId: string;
  content: string;
  type: "title" | "description" | "properties";
}

const embeddingModel = openai.embedding("text-embedding-3-small");

export const generateEmbeddings = inngest.createFunction(
  { id: "generate-embeddings" },
  { event: "app/generate.embeddings" },
  async ({ event, db }) => {
    const { rows } = event.data;

    // TODO: Delete existing embeddings for the rows

    const embeddingResults = await Promise.all(
      rows.map(async (row) => {
        const embeddingChunks = generateChunks(row);

        const { embeddings } = await embedMany({
          model: embeddingModel,
          values: embeddingChunks.map((chunk) => chunk.content),
        });

        return { rowId: row.id, embeddings, embeddingChunks };
      }),
    );

    // Flatten all embedding results into a single array for database insertion
    const allEmbeddings = embeddingResults.flatMap((result) => {
      return result.embeddingChunks.map((chunk, chunkIndex) => ({
        rowId: result.rowId,
        content: chunk.content,
        embedding: result.embeddings[chunkIndex]!,
      }));
    });

    await db.insert(embeddings).values(allEmbeddings);

    return {
      message: `Successfully generated embeddings for ${rows.length} rows`,
      count: rows.length,
    };
  },
);

function generateChunks(row: GenerateEmbeddingsEvent["data"]["rows"][number]) {
  const embeddingChunks: EmbeddingChunk[] = [];

  if (row.name) {
    embeddingChunks.push({
      rowId: row.id,
      content: row.name + (row.icon ? ` ${row.icon}` : ""),
      type: "title",
    });
  }

  if (row.descriptionAsMarkdown) {
    const paragraphs = row.descriptionAsMarkdown
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    paragraphs.forEach((paragraph) => {
      embeddingChunks.push({
        rowId: row.id,
        content: paragraph.toLowerCase(),
        type: "description",
      });
    });
  }

  if (row.cells && row.cells.length > 0) {
    // TODO
  }

  return embeddingChunks;
}
