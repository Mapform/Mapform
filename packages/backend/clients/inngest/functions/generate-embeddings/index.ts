import { rows as rowsSchema } from "@mapform/db/schema";
import { eq } from "@mapform/db/utils";
import { inngest } from "../..";
import { openai } from "../../../openai";

export const generateEmbeddings = inngest.createFunction(
  { id: "generate-embeddings" },
  { event: "app/generate.embeddings" },
  async ({ event, db }) => {
    const { rows } = event.data;

    // Create structured input text for each row
    const inputs = await Promise.all(
      rows.map(async (row) => {
        const sections: string[] = [];

        // Basic row information
        if (row.name) {
          sections.push(`Name: ${row.name.toLowerCase()}`);
        }

        if (row.icon) {
          sections.push(`Icon: ${row.icon}`);
        }

        if (row.descriptionAsMarkdown) {
          // Not a good way to do this, but the blocknote server side util
          // needed to convert to Markdown is not working:
          // https://github.com/TypeCellOS/BlockNote/issues/942#issuecomment-2570750560

          sections.push(
            `Description: ${row.descriptionAsMarkdown.toLowerCase()}`,
          );
        }

        // Process cell data with column context
        if (row.cells && row.cells.length > 0) {
          const cellSections: string[] = [];

          row.cells.forEach((cell) => {
            if (cell.value !== null && cell.value !== undefined) {
              let formattedValue = "";

              switch (cell.columnType) {
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

              if (formattedValue && cell.columnName) {
                cellSections.push(`${cell.columnName}: ${formattedValue}`);
              }
            }
          });

          if (cellSections.length > 0) {
            sections.push(
              `Properties: ${cellSections.join("; ").toLowerCase()}`,
            );
          }
        }

        // Combine all sections with proper spacing
        return sections.join("\n").trim();
      }),
    );

    // Filter out empty inputs
    const validInputs = inputs.filter((input) => input.length > 0);

    if (validInputs.length === 0) {
      console.warn("No valid text content found for embedding generation");
      return {
        message: "No valid content to generate embeddings for",
        count: 0,
      };
    }

    // Split inputs into chunks of 100
    const inputChunks = chunkArray(validInputs, 100);
    const rowChunks = chunkArray(rows, 100);

    let totalProcessed = 0;

    // Process each chunk
    for (let i = 0; i < inputChunks.length; i++) {
      const inputChunk = inputChunks[i];
      const rowChunk = rowChunks[i];

      if (!inputChunk || !rowChunk) {
        console.warn(`Missing chunk data for chunk ${i}`);
        continue;
      }

      // Generate embeddings for current chunk
      const response = await openai.embeddings.create({
        input: inputChunk,
        model: "text-embedding-3-small",
      });

      if (!response.data || response.data.length === 0) {
        console.warn(`No embeddings generated for chunk ${i}`);
        continue;
      }

      // Update each row in the chunk with its corresponding embedding
      const updatePromises = response.data.map((embeddingData, index) => {
        const row = rowChunk[index];
        if (!row || !embeddingData.embedding) {
          console.warn(
            `Missing row or embedding for chunk ${i}, index ${index}`,
          );
          return null;
        }

        return db
          .update(rowsSchema)
          .set({
            embedding: embeddingData.embedding,
          })
          .where(eq(rowsSchema.id, row.id));
      });

      // Execute all updates for this chunk
      await Promise.all(updatePromises.filter(Boolean));

      totalProcessed += response.data.length;
      console.log(
        `Processed chunk ${i + 1}/${inputChunks.length}: ${response.data.length} rows`,
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
