import { inngest } from "../..";
import { openai } from "../../../openai";

export const generateEmbeddings = inngest.createFunction(
  { id: "generate-embeddings" },
  { event: "app/generate.embeddings" },
  async ({ event, step, db }) => {
    const { rows } = event.data;

    // TODO
    const input = rows.map((row) => {
      return `${row.name} ${row.description}`;
    });

    const response = await openai.embeddings.create({
      input,
      model: "text-embedding-3-small",
    });

    console.log(1111, response);

    // await step.sleep("wait-a-moment", "1s");
    // return { message: `Hello ${event.data.email}!` };
    return response;
  },
);
