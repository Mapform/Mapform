import { rows as rowsSchema } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { inngest } from "../..";
import { openai } from "../../../openai";

export const generateEmbeddings = inngest.createFunction(
  { id: "generate-embeddings" },
  { event: "app/generate.embeddings" },
  async ({ event, step, db }) => {
    const { rows } = event.data;

    // Create input text for each row
    const inputs = rows.map((row) => {
      const name = row.name || "";
      const description = row.description?.content
        ? JSON.stringify(row.description.content)
        : "";
      return `${name} ${description}`.trim();
    });

    // Generate embeddings for all rows in batch
    const response = await openai.embeddings.create({
      input: inputs,
      model: "text-embedding-3-small",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No embeddings generated");
    }

    // Update each row with its corresponding embedding
    const updatePromises = response.data.map((embeddingData, index) => {
      const row = rows[index];
      if (!row || !embeddingData.embedding) {
        console.warn(`Missing row or embedding for index ${index}`);
        return null;
      }

      return db
        .update(rowsSchema)
        .set({
          embedding: embeddingData.embedding,
        })
        .where(eq(rowsSchema.id, row.id));
    });

    // Execute all updates
    await Promise.all(updatePromises.filter(Boolean));

    console.log(`Generated embeddings for ${response.data.length} rows`);

    return {
      message: `Successfully generated embeddings for ${response.data.length} rows`,
      count: response.data.length,
    };
  },
);
