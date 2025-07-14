import { embeddings as embeddingsSchema } from "@mapform/db/schema";
import { inngest } from "../..";
import { openai } from "../../../openai";

interface EmbeddingChunk {
  rowId: string;
  content: string;
  type: "title" | "description" | "properties";
}

export const generateEmbeddings = inngest.createFunction(
  { id: "generate-embeddings" },
  { event: "app/generate.embeddings" },
  async ({ event, db }) => {
    const { rows } = event.data;

    // Create multiple chunks per row
    const embeddingChunks: EmbeddingChunk[] = [];

    rows.forEach((row) => {
      // Title chunk
      if (row.name) {
        embeddingChunks.push({
          rowId: row.id,
          content: row.name.toLowerCase(),
          type: "title",
        });
      }

      // Icon chunk
      if (row.icon) {
        embeddingChunks.push({
          rowId: row.id,
          content: `Icon: ${row.icon}`,
          type: "title",
        });
      }

      // Description chunks (split by paragraphs)
      if (row.descriptionAsMarkdown) {
        // Split description by paragraphs (double newlines)
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

      // Properties chunks (group by type or create individual chunks)
      if (row.cells && row.cells.length > 0) {
        const propertyGroups: Record<string, string[]> = {};

        row.cells.forEach((cell) => {
          if (
            cell.value !== null &&
            cell.value !== undefined &&
            cell.columnName &&
            cell.columnType
          ) {
            let formattedValue = "";

            const columnType = cell.columnType;
            switch (columnType) {
              case "string":
                formattedValue = String(cell.value);
                break;
              case "number":
                formattedValue = String(cell.value);
                break;
              case "bool":
                formattedValue = cell.value ? "Yes" : "No";
                break;
              case "date":
                formattedValue = new Date(cell.value).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                );
                break;
              default:
                formattedValue = String(cell.value);
            }

            if (formattedValue && cell.columnName && columnType) {
              const propertyText = `${cell.columnName}: ${formattedValue}`;

              // Group by column type for better semantic grouping
              if (!propertyGroups[columnType]) {
                propertyGroups[columnType] = [];
              }
              propertyGroups[columnType].push(propertyText);
            }
          }
        });

        // Create chunks for each property group
        Object.entries(propertyGroups).forEach(([columnType, properties]) => {
          if (properties.length > 0) {
            embeddingChunks.push({
              rowId: row.id,
              content: properties.join("; ").toLowerCase(),
              type: "properties",
            });
          }
        });
      }
    });

    // Filter out empty chunks
    const validChunks = embeddingChunks.filter(
      (chunk) => chunk.content.length > 0,
    );

    if (validChunks.length === 0) {
      console.warn("No valid text content found for embedding generation");
      return {
        message: "No valid content to generate embeddings for",
        count: 0,
      };
    }

    // Split chunks into batches of 100 for OpenAI API
    const chunkBatches = chunkArray(validChunks, 100);

    let totalProcessed = 0;

    // Process each batch
    for (let i = 0; i < chunkBatches.length; i++) {
      const chunkBatch = chunkBatches[i];

      if (!chunkBatch) {
        console.warn(`Missing batch data for batch ${i}`);
        continue;
      }

      // Extract content for embedding generation
      const contentBatch = chunkBatch.map((chunk) => chunk.content);

      // Generate embeddings for current batch
      const response = await openai.embeddings.create({
        input: contentBatch,
        model: "text-embedding-3-small",
      });

      if (!response.data || response.data.length === 0) {
        console.warn(`No embeddings generated for batch ${i}`);
        continue;
      }

      // Insert embeddings into the embeddings table
      const insertPromises = response.data.map((embeddingData, index) => {
        const chunk = chunkBatch[index];
        if (!chunk || !embeddingData.embedding) {
          console.warn(
            `Missing chunk or embedding for batch ${i}, index ${index}`,
          );
          return null;
        }

        return db.insert(embeddingsSchema).values({
          rowId: chunk.rowId,
          content: chunk.content,
          embedding: embeddingData.embedding,
        });
      });

      // Execute all inserts for this batch
      await Promise.all(insertPromises.filter(Boolean));

      totalProcessed += response.data.length;
      console.log(
        `Processed batch ${i + 1}/${chunkBatches.length}: ${response.data.length} chunks`,
      );
    }

    console.log(`Generated embeddings for ${totalProcessed} rows total`);

    return {
      message: `Successfully generated embeddings for ${totalProcessed} rows`,
      count: totalProcessed,
    };
  },
);

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize),
  );
}
