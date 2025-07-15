import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { embeddings } from "@mapform/db/schema";
import type { GenerateEmbeddingsEvent } from "./schema";
import { inngest } from "../..";
import { inArray } from "@mapform/db/utils";
import { hashContent } from "@mapform/lib/ai/hash-content";

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

    // Get existing embeddings for these rows
    const existingEmbeddings = await db.query.embeddings.findMany({
      where: inArray(
        embeddings.rowId,
        rows.map((row) => row.id),
      ),
    });

    // Generate new chunks for all rows
    const allNewChunks = rows.flatMap((row) => generateChunks(row));

    const newContentHashes = new Set(
      allNewChunks.map((chunk) => hashContent(chunk.content)),
    );

    // Find embeddings to delete (existing embeddings that are no longer needed)
    const embeddingsToDelete = existingEmbeddings.filter((embedding) => {
      return !newContentHashes.has(embedding.contentHash);
    });

    return db.transaction(async (tx) => {
      // Delete embeddings that are no longer needed
      if (embeddingsToDelete.length > 0) {
        await tx.delete(embeddings).where(
          inArray(
            embeddings.id,
            embeddingsToDelete.map((e) => e.id),
          ),
        );
      }

      // Check for existing embeddings with the same content hash
      const existingHashes = new Set(
        existingEmbeddings.map((e) => e.contentHash),
      );

      // Filter out chunks that already have embeddings
      const newChunks = allNewChunks.filter((chunk) => {
        const hash = hashContent(chunk.content);
        return !existingHashes.has(hash);
      });

      let newEmbeddings: Awaited<ReturnType<typeof embedMany>>["embeddings"] =
        [];
      if (newChunks.length > 0) {
        // Generate embeddings only for new chunks
        const { embeddings: generatedEmbeddings } = await embedMany({
          model: embeddingModel,
          values: newChunks.map((chunk) => chunk.content),
        });
        newEmbeddings = generatedEmbeddings;
      }

      // Prepare new embeddings for insertion
      const embeddingsToInsert = newChunks.map((chunk, index) => {
        return {
          rowId: chunk.rowId,
          content: chunk.content,
          contentHash: hashContent(chunk.content),
          embedding: newEmbeddings[index]!,
        };
      });

      // Insert only new embeddings
      if (embeddingsToInsert.length > 0) {
        await tx.insert(embeddings).values(embeddingsToInsert);
      }

      return {
        message: `Successfully processed embeddings for ${rows.length} rows`,
        count: rows.length,
        deleted: embeddingsToDelete.length,
        new: newChunks.length,
      };
    });
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
