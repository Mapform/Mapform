// import { neon } from "@neondatabase/serverless";
// import { PrismaNeonHTTP } from "@prisma/adapter-neon";
// import { PrismaClient } from "@prisma/client";

// const sql = neon(process.env.DATABASE_URL);

// const adapter = new PrismaNeonHTTP(sql);

// export const prisma = new PrismaClient({ adapter });
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient as PrismaClientWithoutExtension } from "@prisma/client";
import { type DocumentContent } from "@mapform/blocknote";
import { stepsExtension } from "./extentsions/steps";
// import dotenv from "dotenv";
// import ws from "ws";

// dotenv.config();
// neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClientWithoutExtension({ adapter }).$extends(
  stepsExtension()
);
type PrismaClientWithExtensions = typeof prisma;
export type PrismaClient = PrismaClientWithExtensions;
export * from "@prisma/client";

declare global {
  namespace PrismaJson {
    type DocumentType =
      | {
          content: DocumentContent;
        }
      | undefined;
  }
}
